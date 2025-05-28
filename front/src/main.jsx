import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from "./components/AuthContext"
import App from './App.jsx'
import Forum from './routes/Forum/Forum.jsx'
import Profile from './routes/Profile.jsx'
import LikedSongs from './routes/LikedSongs.jsx'
import Discover from './routes/Discover.jsx';
import Home from './routes/Home.jsx';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/profile/:id', element: <Profile /> },
  { path: '/liked', element: <LikedSongs /> },
  { path: '/forum', element: <Forum />},
  { path: '/discover', element: <Discover /> },
  { path: '/home', element: <Home /> }
]);

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
)
