import {router} from "@/router.tsx";
import {RouterProvider} from "react-router"
import {Provider} from "react-redux";
import {store} from "@/store";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  )
}

export default App
