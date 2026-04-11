// ============================================================
// DIDACT — Missão 3: Fases de Render/Commit e Reconciliação
// ============================================================

// ---- Missão 1: createElement ----

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      ),
    },
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: { nodeValue: text, children: [] },
  }
}

// ---- Missão 3: updateDom  ----

const isEvent    = key => key.startsWith("on")
const isProperty = key => key !== "children" && !isEvent(key)
const isNew      = (prev, next) => key => prev[key] !== next[key]
const isGone     = (prev, next) => key => !(key in next)

function updateDom(dom, prevProps, nextProps) {
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => isGone(prevProps, nextProps)(key) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      dom.removeEventListener(name.toLowerCase().substring(2), prevProps[name])
    })

  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => { dom[name] = "" })

  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => { dom[name] = nextProps[name] })

  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom.addEventListener(name.toLowerCase().substring(2), nextProps[name])
    })
}

// ---- Missão 2: createDom ----

function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)

  updateDom(dom, {}, fiber.props)
  return dom
}

// ---- Missão 3: Estado global ----

let nextUnitOfWork = null
let wipRoot        = null
let currentRoot    = null 
let deletions      = null 

// ---- Missão 3: render  ----

function render(element, container) {
  wipRoot = {
    dom:       container,
    props:     { children: [element] },
    alternate: currentRoot,
  }
  deletions      = []
  nextUnitOfWork = wipRoot
}

// ---- Missão 3: Fase de Commit  ----

function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot     = null
}

function commitWork(fiber) {
  if (!fiber) return

  let domParentFiber = fiber.parent
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}

// ---- Missão 3: reconcileChildren  ----

function reconcileChildren(wipFiber, elements) {
  let index       = 0
  let oldFiber    = wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  while (index < elements.length || oldFiber != null) {
    const element  = elements[index]
    let newFiber   = null
    const sameType = oldFiber && element && element.type === oldFiber.type

    if (sameType) {
      newFiber = {
        type: oldFiber.type, props: element.props, dom: oldFiber.dom,
        parent: wipFiber, alternate: oldFiber, effectTag: "UPDATE",
      }
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type, props: element.props, dom: null,
        parent: wipFiber, alternate: null, effectTag: "PLACEMENT",
      }
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }

    if (oldFiber)     oldFiber = oldFiber.sibling
    if (index === 0)  wipFiber.child = newFiber
    else if (element) prevSibling.sibling = newFiber
    prevSibling = newFiber
    index++
  }
}

// ---- Missão 2: performUnitOfWork ----

function updateHostComponent(fiber) {
  if (!fiber.dom) fiber.dom = createDom(fiber)
  reconcileChildren(fiber, fiber.props.children)
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) return fiber.child

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
  return undefined
}

// ---- Missão 2: workLoop ----

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

// ---- API pública ----
const Didact = { createElement, render }

// ---- Teste (Missão 3) ----

const container = document.getElementById("root")

function updateApp(titulo, descricao) {
  const element = Didact.createElement(
    "div",
    { style: "background: lightblue; padding: 20px; border-radius: 8px;" },
    Didact.createElement("h1", null, titulo),
    Didact.createElement("p", null, descricao)
  )
  Didact.render(element, container)
}

updateApp("Missão 3: Árvore de Fibras funcionando! 🌳", "Aguarde 2 segundos para a atualização...")

setTimeout(() => {
  updateApp("Missão 3: Reconciliação funcionando! 🔄", "O DOM foi atualizado sem recriar a div container.")
}, 2000)