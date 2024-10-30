import {Menu} from "./render.js"
import * as MENUS from "./menu.js"


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

const MAIN_MENU_SELECTOR = "header [data-menu=main_menu]";

function toggleMenuListener(toggle_click_evt) {
  const toggle = toggle_click_evt.target
  console.debug('toggle_evt?:', toggle)
  const menu = document.querySelector(`${toggle.dataset.toggleMenu ?? MAIN_MENU_SELECTOR}`)
  console.debug('data-toggle:', menu, toggle.dataset.hasOwnProperty('toggle'))
  const dataToggle = toggle.dataset.hasOwnProperty('toggle') ? toggle.dataset.toggle : 'done'
  console.debug('data-toggle-class:', menu, toggle.dataset.hasOwnProperty('toggleClass'))
  const dataToggleClass = toggle.dataset.hasOwnProperty('toggleClass') ? toggle.dataset.toggleClass : 'active'
  toggle.classList.toggle(dataToggle)
  menu.classList.toggle(dataToggleClass)
}

function toggle_menu(selectors = TOGGLE_MENU_SELECTORS) {
  console.debug('toggle_menu(): length:', document.querySelectorAll(selectors))
  document.querySelectorAll(selectors)?.forEach(toggle => {
    if (toggle.dataset.rendered) return
    toggle.addEventListener('click', toggleMenuListener)
    toggle.dataset.rendered = true.toString()
    console.debug("toggle_menu(evt):", toggle)
  })
}

function render_sidebar_menu(menu) {
  console.debug('render_sidebar_menu():', menu)
  let sidebar_classlist = "sidebar-offcanvas-area offcanvas-area inview-right".split(" ")
  const menu_selected = document.body.querySelector(`.${sidebar_classlist.join(".")}${MENU_SELECTORS}`)
  if (menu_selected != null) {
    console.debug("menu already exists:", menu_selected)
    return
  }
  sidebar_classlist.push("fixed", "right-0", 'hidden', '[&.active-offcanvas]:block')
  const offcanvas = menu.cloneNode(true)
  offcanvas.classList.add(...sidebar_classlist)
  document.body.prepend(offcanvas)
  const cancel_sidebar = document.createElement('i')
  cancel_sidebar.classList.add(...'fa fa-close offcanvas-close fixed w-12 hidden group-has-[.active-offcanvas]:block'.split(" "))
  document.body.prepend(cancel_sidebar)
}

function domContentLoadedListener(dom_evt) {
  console.debug('dom_evt?:', dom_evt.target)
  menu_render({
    post_render: render_sidebar_menu
  })
  toggle_menu()
}

document.addEventListener('DOMContentLoaded', domContentLoadedListener/*, {passive: true}*/)

