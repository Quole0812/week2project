import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../components/AuthContext.jsx";
import axios from "axios";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import "./PostDetail.css";

export default function PostDetail() {
    const { postId } = useParams();
    // const { user } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [newComment, setNewComment] = useState("");
    const navigate = useNavigate();
    const { user, login, logout, loading } = useContext(AuthContext);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/home');
        }
    }, [user, loading, navigate]);

    const handleUpvote = async (postId) => {
        const fetchData = async () => {
            try {
                console.log("getting post")
                const resPost = await axios.get(`http://127.0.0.1:3001/forum/posts/${postId}`);
                const resComments = await axios.get(`http://127.0.0.1:3001/forum/posts/${postId}/comments`);
                setPost(resPost.data);
                setComments(resComments.data);
                console.log(resPost.data);
                console.log(resComments.data);
            } catch (error) {
                console.error("uh we got a problem", error);
            }
        };

        try {
            console.log("my fellow american, we are now voting");
            const res = await axios.post(`http://127.0.0.1:3001/forum/posts/${postId}/upvote`, {
                userId: user.id,
            })
            console.log("Upvoted this", res.data);
            fetchData();
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
        const fetchData = async () => {
            try {
                console.log("getting post")
                const resPost = await axios.get(`http://127.0.0.1:3001/forum/posts/${postId}`);
                const resComments = await axios.get(`http://127.0.0.1:3001/forum/posts/${postId}/comments`);
                setPost(resPost.data);
                setComments(resComments.data);
                console.log(resPost.data);
                console.log(resComments.data);
            } catch (error) {
                console.error("uh we got a problem", error);
            }
        };

        fetchData();
    }, [postId]);

    useEffect(() => {
        async function fetchUsers() {
        try {
            console.log("getting users btw")
            const res = await axios.get("http://127.0.0.1:3001/forum/users");
            setUsers(res.data);
            console.log(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
        }

        fetchUsers();
    }, []);


    const handleComment = async (e) => {
        e.preventDefault();
        if(!newComment.trim()) return;

        await axios.post(`http://127.0.0.1:3001/forum/posts/${postId}/comments`, {
        userId: user.id,
        content: newComment,
        });

        setNewComment("");
        const resComments = await axios.get(`http://127.0.0.1:3001/forum/posts/${postId}/comments`);
        setComments(resComments.data);

        if (!post) return <div>Something happened to the post</div>;
    };
    if (!post) return <div>Something happened to the post</div>;
    console.log("bruh i gotta print the post")
    console.log(post);
    const postAuthor = users.find(u => u.id === post.userId);
    const profilePic = postAuthor?.profile_picture ||
    "https://images.unsplash.com/11/sky-rose.jpg?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";


    if (!post || !users) {
        return <div>Something happened to the post</div>;
    } else {
    return (
        <>
        <Sidebar />
      <main className="forum-container2">
         <Link to={`http://127.0.0.1:5173/forum`} className="no-link-style">
        <button className="return-btn3">Return</button>
        </Link>
        <div className="post-card">
            <Link to={`http://127.0.0.1:5173/profile/${post.userId}`} className="no-link-style">
          <div className="post-header2">
            <img src={profilePic} alt="Profile" className="profile-pic" />
            <span className="username">
              {users.find(u => u.id === post.userId).name}
            </span>
          </div>
       </Link>

          <div className="post-title">{post.title}</div>
          <div className="post-content">{post.content}</div>

          <div className="post-actions2">
            <button className="reddit-button" onClick={() => handleUpvote(post.id)}>{post.upvotes} upvote</button>
            <button className="reddit-button" onClick={() => handleCopy(post.id)}>share</button>
          </div>
        </div>
        <div className="commentfixer">
        <form onSubmit={handleComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="comment-input"
          />
          <div className="buttonfix">
          <button type="submit" className="create-btn3">Post</button>
            </div>
        </form>
        </div>

        <div className="comment-list">
          {comments.map((c) => {
            const commenter = users.find((u) => u.id === c.userId);
            const commenterPic = commenter?.profile_picture || profilePic;
            return (
              <div key={c.id} className="comment">
                <Link to={`http://127.0.0.1:5173/profile/${c.userId}`} className="no-link-style">
                <div className="post-header">
                  <img src={commenterPic} alt="pfp" className="profile-pic" />
                  <span className="username">{users.find((u) => u.id === c.userId).name}</span>
                </div>
                </Link>
                <div className="post-content">{c.content}</div>
              </div>
            );
          })}
        </div>
      </main>
        </>
    );

    
}
}