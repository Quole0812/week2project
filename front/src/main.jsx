import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx'
import Discover from './routes/Discover.jsx';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/discover', element: <Discover /> }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
