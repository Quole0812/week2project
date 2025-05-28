import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../components/AuthContext.jsx";
import axios from "axios";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import "./PostDetail.css";

export default function PostDetail() {
    const { postId } = useParams();
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [newComment, setNewComment] = useState("");


    useEffect(() => {
        const fetchData = async () => {
        const resPost = await axios.get(`http://127.0.0.1:3001/forum/posts/${postId}`);
        const resComments = await axios.get(`http://127.0.0.1:3001/forum/posts/${postId}/comments`);
        setPost(resPost.data);
        setComments(resComments.data);
        };

        fetchData();
    }, [postId]);

    useEffect(() => {
        async function fetchUsers() {
        try {
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
    return (
        <>
        <Sidebar />
        <main className="post-detail-container">
            <h1>{post.title}</h1>
            <p className="post-author">by {user.id === post.userId ? "You" : post.userId}</p>
            <p>{post.content}</p>

            <h2>Comments</h2>
            <form onSubmit={handleComment}>
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
            />
            <button type="submit" className="submit-comment">Post</button>
            </form>

            <div className="comment-list">
            {comments.map((c) => (
                <div key={c.id} className="comment">
                <strong>{c.username || c.userId}</strong>: {c.content}
                </div>
            ))}
            </div>
        </main>
        </>
    );

    
}