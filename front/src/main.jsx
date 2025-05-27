import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx'
import Forum from './routes/Forum.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/forum', element: <Forum />}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
