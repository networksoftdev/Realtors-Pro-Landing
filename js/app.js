import {Menu} from "./render.js"
import * as MENUS from "./menu.js"
import {EventTracker, test as testEventTracker} from "./EventTracker";

const events = new EventTracker()

const MENU_SELECTORS = "[data-menu]"
const  TOGGLE_MENU_SELECTORS = "[data-toggle-menu], header ul>li.current-menu span"

function menu_render({selectors = MENU_SELECTORS, post_render = undefined}) {
  console.debug('menu_render():', selectors)
  document.querySelectorAll(selectors)?.forEach(menu => {
    console.debug('menu:', menu)
    const menu_data = menu.dataset
    const menu_elements = MENUS[menu_data.menu] ?? []
    Menu({items: menu_elements, from: menu})
    if (post_render) {
      post_render(menu)
    }
  })
}

const MAIN_MENU_SELECTOR = "header [data-menu]";
const SIDEBAR_SELECTOR = ".sidebar-offcanvas-area";
const SIDEBAR_ACTIVE_CLASS = "active-offcanvas";

function resolveToggleTarget(toggle) {
  if (toggle.dataset.toggleMenu) return document.querySelector(toggle.dataset.toggleMenu)
  // e.g. the current-menu <span> inside the header menu toggles its own menu
  return toggle.closest('[data-menu]') ?? document.querySelector(MAIN_MENU_SELECTOR)
}

function toggleMenuListener(toggle_click_evt) {
  // currentTarget is the element the listener is bound to, even when a child (<span>) is clicked
  const toggle = toggle_click_evt.currentTarget
  toggle_click_evt.preventDefault()
  toggle_click_evt.stopPropagation()
  console.debug('toggle_evt?:', toggle)
  const menu = resolveToggleTarget(toggle)
  if (!menu) {
    console.debug('toggleMenuListener(): no menu found for', toggle)
    return
  }
  const dataToggle = toggle.dataset.toggle ?? 'done'
  const dataToggleClass = toggle.dataset.toggleClass ?? 'active'
  console.debug('toggle:', menu, dataToggle, dataToggleClass)
  if (dataToggleClass === SIDEBAR_ACTIVE_CLASS) {
    menu.classList.contains(SIDEBAR_ACTIVE_CLASS) ? closeSidebar() : openSidebar()
    return
  }
  toggle.classList.toggle(dataToggle)
  menu.classList.toggle(dataToggleClass)
}

function toggleKeyListener(evt) {
  if (evt.repeat) return
  if (evt.key === 'Enter' || evt.key === ' ') {
    evt.preventDefault()
    evt.currentTarget.click()
  }
}

function toggle_menu(selectors = TOGGLE_MENU_SELECTORS) {
  console.debug('toggle_menu(): length:', document.querySelectorAll(selectors))
  document.querySelectorAll(selectors)?.forEach(toggle => {
    if (toggle.dataset.rendered) return
    addTrackedEvent({element: toggle, event: 'click', listener: toggleMenuListener})
    addTrackedEvent({element: toggle, event: 'keydown', listener: toggleKeyListener})
    toggle.dataset.rendered = true.toString()
    console.debug("toggle_menu(evt):", toggle)
  })
}

/** sidebar (off-canvas) */

function sidebarToggles() {
  return document.querySelectorAll(`[data-toggle-menu="${SIDEBAR_SELECTOR}"]`)
}

// Ignore toggles while the drawer is animating (absorbs double clicks, ghost taps and key auto-repeat)
const SIDEBAR_TOGGLE_LOCK_MS = 350
let sidebarLockedUntil = 0

function setSidebarState(open) {
  const sidebar = document.querySelector(SIDEBAR_SELECTOR)
  if (!sidebar) return
  const now = Date.now()
  if (sidebar.classList.contains(SIDEBAR_ACTIVE_CLASS) === open) {
    console.debug('setSidebarState(): already', open ? 'open' : 'closed')
    return
  }
  if (now < sidebarLockedUntil) {
    console.debug('setSidebarState(): ignored, transition in progress')
    return
  }
  sidebarLockedUntil = now + SIDEBAR_TOGGLE_LOCK_MS
  sidebar.classList.toggle(SIDEBAR_ACTIVE_CLASS, open)
  sidebar.setAttribute('aria-hidden', (!open).toString())
  sidebar.inert = !open
  sidebarToggles().forEach(toggle => {
    toggle.classList.toggle(toggle.dataset.toggle ?? 'done', open)
    toggle.setAttribute('aria-expanded', open.toString())
  })
  console.debug('setSidebarState():', open)
  if (open) {
    sidebar.querySelector('.offcanvas-close')?.focus()
  } else {
    sidebarToggles()[0]?.focus()
  }
}

function openSidebar() {
  setSidebarState(true)
}

function closeSidebar() {
  setSidebarState(false)
}

function sidebarKeyListener(evt) {
  if (evt.key === 'Escape' && document.querySelector(`${SIDEBAR_SELECTOR}.${SIDEBAR_ACTIVE_CLASS}`)) {
    closeSidebar()
  }
}

const SIDEBAR_CLASSLIST = [
  "sidebar-offcanvas-area", "offcanvas-area",
  "fixed", "inset-y-0", "right-0", "z-[1100]", "w-80", "max-w-[85vw]", "overflow-y-auto",
  "m-0", "list-none", "px-8", "pt-24", "pb-10",
  "bg-ink-900/95", "backdrop-blur", "border-l", "border-gold-400/25", "shadow-gold",
  "translate-x-full", "transition-transform", "duration-300", "ease-out",
  "[&.active-offcanvas]:translate-x-0",
  // links
  "[&_li]:border-b", "[&_li]:border-gold-400/10",
  "[&_a]:flex", "[&_a]:items-center", "[&_a]:gap-3", "[&_a]:py-4",
  "[&_a]:font-accent", "[&_a]:text-sm", "[&_a]:uppercase", "[&_a]:tracking-[0.2em]",
  "[&_a_i]:w-5", "[&_a_i]:h-5", "[&_a_i]:shrink-0",
]

function render_sidebar_menu(menu) {
  console.debug('render_sidebar_menu():', menu)
  const menu_selected = document.body.querySelector(`${SIDEBAR_SELECTOR}${MENU_SELECTORS}`)
  if (menu_selected != null) {
    console.debug("menu already exists:", menu_selected)
    return
  }
  const offcanvas = menu.cloneNode(true)
  // drop header-only layout classes so header CSS does not apply to the drawer
  offcanvas.className = ''
  offcanvas.classList.add(...SIDEBAR_CLASSLIST)
  offcanvas.id = 'sidebar-menu'
  offcanvas.setAttribute('aria-label', 'Menú')
  offcanvas.setAttribute('aria-hidden', 'true')
  offcanvas.inert = true

  const cancel_sidebar = document.createElement('button')
  cancel_sidebar.type = 'button'
  cancel_sidebar.setAttribute('aria-label', 'Cerrar menú')
  cancel_sidebar.classList.add(...'fa fa-close offcanvas-close absolute top-6 right-6 w-10 h-10 p-2 rounded-full border border-gold-400/40 hover:border-gold-400 bg-transparent cursor-pointer'.split(" "))
  addTrackedEvent({element: cancel_sidebar, event: 'click', listener: closeSidebar})
  // a held Enter/Space from the hamburger must not "click" the close button once focus moves here
  addTrackedEvent({element: cancel_sidebar, event: 'keydown', listener: evt => {
    if (evt.repeat) evt.preventDefault()
  }})

  const sidebar = document.createElement('li')
  sidebar.classList.add('!border-0')
  sidebar.appendChild(cancel_sidebar)
  offcanvas.prepend(sidebar)

  const backdrop = document.createElement('div')
  backdrop.classList.add(...'offcanvas-backdrop fixed inset-0 z-[1090] bg-black/70 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 group-has-[.active-offcanvas]:opacity-100 group-has-[.active-offcanvas]:pointer-events-auto'.split(" "))
  backdrop.setAttribute('aria-hidden', 'true')
  addTrackedEvent({element: backdrop, event: 'click', listener: closeSidebar})

  // close after following a link inside the drawer
  addTrackedEvent({element: offcanvas, event: 'click', listener: evt => {
    if (evt.target.closest('a')) closeSidebar()
  }})

  document.body.classList.add('has-[.active-offcanvas]:overflow-hidden')
  document.body.prepend(offcanvas)
  document.body.prepend(backdrop)
  addTrackedEvent({element: document, event: 'keydown', listener: sidebarKeyListener})
}

function domContentLoadedListener(dom_evt) {
  console.debug('dom_evt?:', dom_evt.target)
  menu_render({
    post_render: render_sidebar_menu
  })
  toggle_menu()
}

function addTrackedEvent({element = document, event = 'DOMContentLoaded', listener = domContentLoadedListener}) {
  events.element = element
  if (events.getEventListeners()?.length <= 0 || events.getEventListeners().filter(e => e.event === event && e.listener === listener).length <= 0) {
    events.addEventListener(event, listener)
  }
}

/** execution */

if (!window.__REALTORS_PRO_APP__) {
  window.__REALTORS_PRO_APP__ = true
  testEventTracker()
  addTrackedEvent({});
} else {
  console.debug('app.js already initialised, skipping')
}

// document.addEventListener('DOMContentLoaded', domContentLoadedListener/*, {passive: true}*/)

