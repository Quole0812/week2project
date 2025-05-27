import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from "./components/AuthContext"
import App from './App.jsx'
import Forum from './routes/Forum.jsx'
import Profile from './routes/Profile.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/profile/:id', element: <Profile /> },
  { path: '/forum', element: <Forum />},

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
