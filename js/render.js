const MENU_TAG = 'nav'
const CURRENT_MENU_ITEM_CLASSLIST = ["current-menu-item", "current-menu"]
const MENU_ITEM_CLASSLIST = ["menu-item", "menu-item-$"]

const RenderElement = function({element, rendering, ...args}) {
  console.debug("RenderElement?:", args, typeof args)
  if (element.dataset.rendered){
    return element
  }
  element = rendering(element, {...args})
  element.dataset.rendered=true.toString()
  return element
}

const RenderMenuItems = (menu, {items}) => {
  console.debug("RenderMenuItems?:", menu, items)
  items.forEach(element => {
    const li = document.createElement('li')
    if (element.current) {
      CURRENT_MENU_ITEM_CLASSLIST.forEach(cls=>li.classList.add(cls))
    }
    MENU_ITEM_CLASSLIST.forEach(cls=> {
      li.classList.add((cls.endsWith("$")?cls.replaceAll("$", (element.title.toLowerCase().replaceAll(" ", "-"))):cls))
    })
    const a = document.createElement('a')
    a.href=element.href
    a.dataset.title = element.title
    a.innerText=element.title
    if ((element.icon && element.icon.length > 0) || element.title === "Home") {
      const i = document.createElement('i')
      i.classList.add("fa",`fa-${element.icon ?? 'home'}`)
      a.prepend(i)
      const span = document.createElement('span')
      li.appendChild(span)
    }
    li.appendChild(a)
    menu.appendChild(li)
    console.debug('Menu element', li)
  })
  return menu
}

export const Menu = ({items = [], from = undefined}) => {
  let menu_element = from
  if (!menu_element) {
    menu_element = document.createElement(MENU_TAG)
  } else if (typeof from === "string" && from.length > 0) {
    menu_element = document.querySelector(from) ?? (document.createElement(from) ?? document.createElement(MENU_TAG))
  }
  return RenderElement({element: menu_element, rendering: RenderMenuItems, items})
}
