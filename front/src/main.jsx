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
import EditProfile from './routes/EditProfile.jsx';
import CreatePost from './routes/Forum/CreatePost/CreatePost.jsx';
import PostDetail from './routes/Forum/PostDetail/PostDetail.jsx';
import TopArtists from './routes/TopArtists.jsx';
import Inbox from './routes/Inbox.jsx'
import InboxChat from './routes/InboxChat.jsx'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/profile/:id', element: <Profile /> },
  { path: '/editprofile/:id', element: <EditProfile /> },
  { path: '/liked', element: <LikedSongs /> },
  { path: '/forum', element: <Forum />},
  { path: '/discover', element: <Discover /> },
  { path: '/home', element: <Home /> },
  { path: '/forum/create', element: <CreatePost />},
  { path: '/forum/posts/:postId', element: <PostDetail />},
  { path: '/top-artists', element: <TopArtists /> },
  { path: '/inbox', element: <Inbox /> },
  { path: '/inbox/:id', element: <InboxChat /> }
]);

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
)
