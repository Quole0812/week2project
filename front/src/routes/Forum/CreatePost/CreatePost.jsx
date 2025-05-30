import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../components/AuthContext.jsx";
import axios from 'axios';
import Sidebar from '../../../components/Sidebar/Sidebar';
import './CreatePost.css';


export default function CreatePost() {
    const { user } = useContext(AuthContext);
    // console.log(user);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [flair, setFlair] = useState('');
    const maxChars = 300; //set a limit on title 
    const [selectedFlairs, setSelectedFlairs] = useState([]);
    const [showFlairOptions, setShowFlairOptions] = useState(false);
    const flairOptions = ["Discussion", "Question", "News"];

    //handle buttom submit here
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return; //reddit forced title
        try {
            await axios.post('http://127.0.0.1:3001/forum/posts', {
                userId: user.id,
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
            {/* <h1 className='create-post-title'>Create Post</h1> */}
            <form onSubmit={handleSubmit} className='create-post-form'>
                <h1 className='create-post-title'>Create Post</h1>
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
                     <span className='char-count'>{title.length}/{maxChars}</span>

                </div>
                {/* <button
                    type="button"
                    className="add-flair-btn"
                    onClick={() => setFlair('Discussion')} // maybe add a dropdown
                >
                    add filter
                </button> */}
                
                {/* <div className="flair-selector">
            <button
                type="button"
                className="add-flair-btn"
                onClick={() => setShowFlairOptions(!showFlairOptions)}
            >
                {selectedFlairs.length > 0 ? `Flairs (${selectedFlairs.length})` : "Add Flairs"}
            </button>

            {showFlairOptions && (
                <ul className="flair-dropdown">
                {flairOptions.map((option) => {
                    const isSelected = selectedFlairs.includes(option);
                    return (
                    <li
                        key={option}
                        className={isSelected ? "selected" : ""}
                        onClick={() => {
                        if (isSelected) {
                            setSelectedFlairs(selectedFlairs.filter(f => f !== option));
                        } else {
                            setSelectedFlairs([...selectedFlairs, option]);
                        }
                        }}
                    >
                        {isSelected ? "✓ " : ""}{option}
                    </li>
                    );
                })}
                </ul>
            )}


            <div className="selected-flairs">
                    {selectedFlairs.map(flair => (
                        <span key={flair} className="flair-chip">
                            {flair}
                            <button
                            type="button"
                            className="remove-flair"
                            onClick={() =>
                                setSelectedFlairs(selectedFlairs.filter(f => f !== flair))
                            }
                            >
                            ✕
                            </button>
                        </span>
                        ))}
                    </div>
                </div>
                 */}
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