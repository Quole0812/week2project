import { useState, useEffect, use } from "react";
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
        <>
            {loading ? (
                <div>Loading...</div>
            ) :
            error ? (
                <div>Error: {error}</div>
            ) : (
                <div>
                    <h1>Discover Users</h1>
                    {users.map((user => (
                        <div key={user.id}>
                            {/* pass these names to DiscoverGrid */}
                            <strong>{user.name}</strong>  
                            <br />
                        </div>
                        
                        
                    )
                    ))}
                    
                </div>
            )}
        </>
    );
}