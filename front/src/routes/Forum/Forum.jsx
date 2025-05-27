import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import { useContext } from "react";
import { AuthContext } from "../../components/AuthContext.jsx";
import './Forum.css'


export default function Forum() {
    const { user, login, logout, loading } = useContext(AuthContext);

    //3. if user is not null, they are logged in
    //4. login and logout are functions that can be called to have a user sign in/sign out
    //5. set loading screen if loading is true
    if (loading) {
        return (<></>)
    } else {
      return (
        <>
        <Sidebar/>
        <main className='forum-container'>
        {/* now we do the search bar  */}
        <div className='search-bar'>
            <input type='text' placeholder='Search posts...'></input>
        </div>

        {/* now the header */}
        <h1 className='forum-title'>Forum Page</h1>

        <div className="forum-controls">
            <button className="filter-btn">filter by: Recent</button>
            <button className="create-btn">Create Post</button>
        </div>


        <div className="post-card">
            <div className="post-header">
                <div className="avatar-circle"></div>
                <span className="username">User something</span>
            </div>
            <div className="post-title">Post Title: something something</div>
            <div className="post-content">Content/Photos/Video?</div>
            <div className="post-actions">
                <button>upvote placeholder</button>
                <button>icon placeholder</button>
                <button>share placeholder</button>
            </div>
        </div>


        </main>


        </>
    );  
    };
    
};
