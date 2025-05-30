import { useState, useEffect, use } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import DiscoverGrid from "../components/Discover/DiscoverGrid";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";



export default function Discover() {
    const { user, login, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(true); // loading state to show loading spinner
    const [users, setUsers] = useState([{}]); // array of objects to hold user data
    const [error, setError] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/home');
        }
    }, [user, loading, navigate]);


    const apiUrl = "http://127.0.0.1:3001/discover";
      
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

    const handleSearch = (list, searchValue) => {
        if (loading) return;
        setSearchValue(searchValue);
        if (searchValue !== "") {
                const filtered = list.filter((user) => 
                    user.name.toLowerCase().includes(searchValue.toLowerCase()));
                setFilteredUsers(filtered);
            }
        else {
            setFilteredUsers([]);
        }
        
    }
    
    return (
        <>
            <div className="discover-main-bg">
                <Sidebar />
                <div className="discover-center-wrapper">
                    <div className="discover-top">
                        <div className="discover-search-wrapper">
                            <div className="discover-search-input-wrapper">
                                <SearchIcon className="search-icon" />
                                <input
                                type="search"
                                className="discover-search-bar"
                                placeholder="Search for users..."
                                onChange={(e) => handleSearch(users, e.target.value)}
                                />
                            </div>
                        </div>

                        {searchValue !== "" ? (
                            <h1 className="discover-results-header">Results for '{searchValue}'</h1>
                        ) : (
                            <h1 className="discover-results-header">Discover user profiles</h1>
                        )}

                        <div className="discover-main-content">
                            <div className="scrollable-content">

                            
                            {loading ? (
                                <div className="discover-container">
                                    {[...Array(3)].map((_, index) => (
                                        <div className="discover-card" key={index}>
                                            <div className="discover-profile-picture" />
                                            <div className="discover-card-text" />
                                        </div>
                                    ))}
                                </div>
                            ) : error ? (
                                <div>Error: {error}</div>
                            ) : searchValue !== "" ? (
                                <div className="discover-container">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user, index) => (
                                            <Link to={`../profile/${user.id}`} className="discover-card-link">
                                                <div className="discover-card" key={index}>
                                                    <div className="discover-profile-picture-wrapper">
                                                    <img src={user?.profile_picture} className="discover-profile-picture" />
                                                    </div>
                                                    <strong className="discover-card-text">{user.name}</strong>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div>
                                            <strong className="discover-card-text">No results found.</strong>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="discover-container">
                                    {users.map((user, index) => (
                                        <Link to={`../profile/${user.id}`} className="discover-card-link">
                                            <div className="discover-card" key={index}>
                                                <div className="discover-profile-picture-wrapper">
                                                <img src={user?.profile_picture} className="discover-profile-picture" />
                                                </div>
                                                <strong className="discover-card-text">{user.name}</strong>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}