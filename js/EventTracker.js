export class EventTracker {
  constructor(element = null) {
    this.events = new Map()
    this._element = element
  }

  get element() {
    if (this._element === null) {
      console.warn('Element is null')
    } else if (this._element) {
      if (this._element instanceof HTMLCollection) {
        console.debug('Element is an HTMLCollection')
      } else if (this._element instanceof HTMLElement) {
        console.debug('Element is an HTMLElement')
      } else if (this._element instanceof Node) {
        console.debug('Element is a Node')
      } else if (!this._element instanceof Element) {
        console.debug('Element is an Element')
      }
    } else {
      console.warn('Element not found or undefined')
    }
    return this._element
  }

  set element(value) {
    this._element = value
  }

  addEventListener(event, listener) {
    if (!this.events.has(this._element)) {
      this.events.set(this._element, [])
    }
    if (this.element) this.events.get(this._element).push({event, listener})
    this.element?.addEventListener(event, listener)
    this.getEventListeners(true)
  }

  removeEventListener(event, listener) {
    if (this.events.has(this._element)) {
      this.events.set(this._element, this.events.get(this._element).filter(
        e => e.event !== event || e.listener !== listener
      ))
    }
    this.element?.removeEventListener(event, listener)
    this.getEventListeners(true)
  }

  getEventListeners(debug = false) {
    if (this.events.has(this._element)) {
      const listeners = this.events.get(this._element)
      if (debug) console.debug('listeners:', listeners, "element:", this._element)
      return listeners
    }
    if (debug) console.debug('events:', this.events)
    return []
  }
}

// Uso
export function test(elementId = 'myElement') {
  const element = document.getElementById(elementId)
  const tracker = new EventTracker(element)

  function handleClick() {
    console.log('Element clicked!')
  }

// Agregar event listener
  tracker.addEventListener('click', handleClick)
// Obtener event listeners
  console.debug("EventTracker():test", tracker.getEventListeners())
// Eliminar event listener
  tracker.removeEventListener('click', handleClick)
}
