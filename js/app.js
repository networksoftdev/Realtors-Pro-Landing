import {Menu} from "./render.js"
import * as MENUS from "./menu.js"


const MENU_SELECTORS = "[data-menu]"

function menu_render({selectors = MENU_SELECTORS, post_render = undefined}) {
  console.debug('menu_render:', selectors)
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

function render_sidebar_menu(menu) {
  console.debug('render_sidebar_menu?:', menu)
  let sidebar_classlist = "sidebar-offcanvas-area offcanvas-area inview-right".split(" ")
  const menu_selected = document.body.querySelector(`.${sidebar_classlist.join(".")}${MENU_SELECTORS}`)
  if (menu_selected != null) {
    console.debug(menu_selected)
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

document.addEventListener('DOMContentLoaded', (dom_evt) => {
  console.debug('dom_evt?:', dom_evt)
  menu_render({
    post_render: render_sidebar_menu
  })
})

