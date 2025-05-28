import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../components/AuthContext.jsx";
import axios from 'axios';
import Sidebar from '../../../components/Sidebar/Sidebar';
import './CreatePost.css';


export default function CreatePost() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [flair, setFlair] = useState('');
    const maxChars = 300; //set a limit on title 

    //handle buttom submit here
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return; //reddit forced title
        try {
            await axios.post('api/forum/posts', {
                userId: user?.uid,
                title,
                content,
                flair,
            });

            navigate('/forum'); //go back once we finish making page
        } catch (error) {
            console.error("uh i can't make the post", error);
        }
    };


    return (
        <>
        <Sidebar></Sidebar>
        <main className='create-post-container'>
            <h1 className='create-post-title'>Create Post</h1>
            <form onSubmit={handleSubmit} className='create-post-form'>
                <div className='input-container'>
                    <input
                    className='title-input'
                    type='text'
                    placeholder='Title?'
                    maxLength={maxChars}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required>    
                    </input>
                    <span className='"char-count'>{title.length}/{maxChars}</span>
                </div>

                <button
                    type="button"
                    className="add-flair-btn"
                    onClick={() => setFlair('Discussion')} // maybe add a dropdown
                >
                    add filter
                </button>

                <textarea
                    className="body-textarea"
                    placeholder="Body Text (optional)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button type="submit" className="create-btn">Create</button>


            </form>





        </main>




        </>
    )
}