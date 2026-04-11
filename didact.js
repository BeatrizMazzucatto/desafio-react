// ============================================================
// DIDACT — Missão 2: Modo Concorrente e Árvore de Fibras
// ============================================================

// ---- Missão 1: createElement (sem alterações) ----

// Transforma JSX em um objeto simples representando um elemento de UI.
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

// Cria um nó virtual para conteúdo de texto puro.
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

// ---- Missão 2: Funções auxiliares de fibra ----

function updateDom(dom, prevProps, nextProps) {
  Object.keys(nextProps)
    .filter(k => k !== "children")
    .forEach(k => { dom[k] = nextProps[k] })
}

function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)

  updateDom(dom, {}, fiber.props)
  return dom
}

// ---- Missão 2: Estado global ----

let nextUnitOfWork = null 
let wipRoot = null        

// ---- Missão 2: Work Loop  ----

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

function commitRoot() {}
function reconcileChildren(wipFiber, elements) {}

// ---- Missão 2: Funções de atualização de componente ----

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber) 
  }
  reconcileChildren(fiber, fiber.props.children)
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)] 
  reconcileChildren(fiber, children)
}

// ---- Missão 2: performUnitOfWork ----

function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling 
    }
    nextFiber = nextFiber.parent 
  }

  return undefined
}

// ---- Teste: Travessia de Fibras (Missão 2) ----
/* Árvore simulada:
      A
     / \
    B   D
   /
  C
*/
const fiberC = { type: "C", props: { children: [] } }
const fiberB = { type: "B", props: { children: [] }, child: fiberC }
const fiberD = { type: "D", props: { children: [] } }
const fiberA = { type: "A", props: { children: [] }, child: fiberB }

fiberC.parent = fiberB
fiberB.parent = fiberA
fiberD.parent = fiberA
fiberB.sibling = fiberD

// Substitui temporariamente updateHostComponent para não tocar no DOM
const _originalUpdateHost = updateHostComponent
updateHostComponent = (fiber) => { console.log("Visitando nó:", fiber.type) }

console.log("--- Iniciando Teste de Travessia de Fibras ---")
let nextUnit = fiberA
while (nextUnit) {
  nextUnit = performUnitOfWork(nextUnit)
}
console.log("--- Travessia Concluída (esperado: A, B, C, D) ---")

updateHostComponent = _originalUpdateHost
