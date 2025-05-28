import { useState, useEffect, use } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from "../components/Sidebar/Sidebar";
import DiscoverGrid from "../components/Discover/DiscoverGrid";
import axios from "axios";


export default function Discover() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
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
    
    return (
            <div className="discover-main-bg">
                <h1 className="discover-results-header">Discover</h1>
                <div className="discover-main-content">
                    
                    {loading ? (
                    <div>Loading...</div>
                    ) :
                    error ? (
                        <div>Error: {error}</div>
                    ) : (
                            <div className="discover-container">
                                
                                {users.map((user => (
                                    <div className="discover-card" key={user.id}>
                                        {/* pass these names to DiscoverGrid */}
                                        <strong className="discover-card-text"><span style={{ verticalAlign: 'bottom' }}>{user.name}</span></strong>  
                                        {/* <br /> */}
                                    </div>
                                    
                                
                                
                            )
                            ))}
                            <div className="discover-card" >
                                    test
                                    </div>
                            </div>
                    )}
                </div>
                {/* <Sidebar /> */}
                
                
                
            </div>
    );
}