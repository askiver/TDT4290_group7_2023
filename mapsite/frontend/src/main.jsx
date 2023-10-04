import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"


import App from './App.jsx'
import Map from './routes/Map.jsx'
import './index.css'
import '../node_modules/leaflet-geosearch/dist/geosearch.css';

const router = createBrowserRouter([
  {
      path: "/",
      element: <App/>
  },
  {
      path: "/map",
      element: <Map/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
