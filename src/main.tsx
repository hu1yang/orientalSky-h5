import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {unstableSetRender} from "antd-mobile";
import App from './App.tsx'
import './index.css'
import './i18n/index'

const rootMap = new WeakMap<Element | DocumentFragment, ReturnType<typeof createRoot>>()
unstableSetRender((node, container) => {

  let root = rootMap.get(container)
  if (!root) {
    root = createRoot(container as Element)
    rootMap.set(container, root)
  }

  root.render(node)
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
    await Promise.resolve()
    root?.unmount()
    rootMap.delete(container)
  }
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App/>
    </StrictMode>,
)


