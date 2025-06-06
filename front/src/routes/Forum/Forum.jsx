import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/AuthContext.jsx";
import './Forum.css'
import axios from "axios";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ShareIcon from '@mui/icons-material/Share';


export default function Forum() {
    const { user, login, logout, loading } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

        useEffect(() => {
        if (!loading && !user) {
            navigate('/home');
        }
    }, [user, loading, navigate]);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleUpvote = async (postId) => {
        async function fetchPosts() {
            try {
                const res = await axios.get("http://127.0.0.1:3001/forum/posts");
                setPosts(res.data);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            }
        }

        try {
            console.log("my fellow american, we are now voting");
            const res = await axios.post(`http://127.0.0.1:3001/forum/posts/${postId}/upvote`, {
                userId: user.id,
            })
            console.log("Upvoted this", res.data);
        } catch (error) {
            if (error.response?.status === 400) {
                alert("fam u alr upvoted this");
            } else {
            console.error("Error upvoting:", error);
            }
        }
        fetchPosts();
    };

    const handleCopy = async(postId) => {
        try {
            navigator.clipboard.writeText(`http://127.0.0.1:5173/forum/posts/${postId}`)
            .then(() => {
                console.log("Link copied to clipboard:", link);
                // Optionally show a toast or alert here
            })
        } catch (error) {
            console.error("ayo i cant copy")
        }
    }


    useEffect(() => {
        async function fetchPosts() {
        try {
            const res = await axios.get("http://127.0.0.1:3001/forum/posts");
            setPosts(res.data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        }
        }

        fetchPosts();
    }, []);


    useEffect(() => {
        async function fetchUsers() {
        try {
            const res = await axios.get("http://127.0.0.1:3001/forum/users");
            setUsers(res.data);
            console.log(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
        }

        fetchUsers();
    }, []);


    if (loading) {
        return (<></>)
    } else {
      return (
        <>
        <Sidebar/>
        <main className='forum-container'>
        {/* now we do the search bar  */}
        <div className='search-bar'>
            <input type='text' placeholder='Search posts...' value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}></input>
        </div>

        {/* now the header */}
        <h1 className='forum-title'>Forum Page</h1>

        <div className="forum-controls">
            <Link to="/forum/create">
            <button className="create-btn">Create Post</button></Link>
        </div>

        <div className='all-post'>
        {filteredPosts.map((post) => (
          <div key={post.id} className="post-card">
            <Link to={`http://127.0.0.1:5173/profile/${post.userId}`} className="no-link-style">
            <div className="post-header">

              {/* <div className="avatar-circle"></div> */}
              <img
                src={
                    (users.find(u => u.id === post.userId)?.profile_picture) || "https://images.unsplash.com/11/sky-rose.jpg?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                alt="Profile"
                className="profile-pic"
                />
              <span className="username">{users.find(u => u.id === post.userId)?.name }</span>
            </div>
            </Link>
            <Link to={`/forum/posts/${post.id}`} className="post-card no-link-style">
            <div className="post-title">{post.title}</div>
            {/* <div className="post-content">{post.content || "No content."}</div> */}
            </Link>
            <div className="post-actions">
              <button className='reddit-button' onClick={() => handleUpvote(post.id)}> {post.upvotes} upvotes</button>
              {/* <Link to={`/forum/posts/${post.id}`} className="no-link-style">
              <button className='reddit-button'>comment</button></Link> */}
              <button className='reddit-button' onClick={() => handleCopy(post.id)}><ShareIcon style={{ fontSize: '10px' }}/></button>
            </div>
          </div>
        ))}
        </div>


        </main>


        </>
    );  
    };
    
};
