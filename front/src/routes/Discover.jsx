import { useState, useEffect, use } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import DiscoverGrid from "../components/Discover/DiscoverGrid";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";



export default function Discover() {
    const { user, login, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(true); // loading state to show loading spinner
    const [users, setUsers] = useState([{}]); // array of objects to hold user data
    const [error, setError] = useState(null);


    const apiUrl = "http://127.0.0.1:3001/profile";
      
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(apiUrl);
                setUsers(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                
            }
        };

        fetchUsers();

    }, [])

    useEffect(() => {
        if (!loading) {
            console.log("Users fetched:", users);
        }
    }, [users, loading]);
    
    return (
            <div className="discover-main-bg">
                <Sidebar />
                <div className="discover-top">
                    <input type="text" className="discover-search-bar" placeholder="Search for users..." />
                    <h1 className="discover-results-header">Discover</h1>
                    <div className="discover-main-content">
                        
                        {loading ? (
                            <>
                                <div className="discover-container">
                                    {[...Array(3)].map((_, index) => (
                                        <div className="discover-card" key={index}>
                                            <div className="discover-profile-picture" />
                                            <div className="discover-card-text" />
                                        </div>
                                    ))}
                                </div>

                            </>
                        
                        ) :
                        error ? (
                            <div>Error: {error}</div>
                        ) : (
                               
                                <div className="discover-container">
                                    
                                    {users.map((user => (
                                        <Link to="/profile/{user.id}">
                                            <div className="discover-card" key={user.id}>
                                                {/* pass these names to DiscoverGrid */}
                                                
                                                <img src={user?.profile_picture} className="discover-profile-picture" />
                                                <strong className="discover-card-text"><span style={{ alignContent: 'flex-end' }}>{user.name}</span></strong>  
                                                {/* <br /> */}
                                            </div>
                                        </Link>
                                        
                                    
                                    
                                    )
                                    ))}
                                </div>
                        )}
                    </div>
                
                
                
                </div>
            </div>
    );
}