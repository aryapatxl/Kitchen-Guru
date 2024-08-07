'use client';
import React, {useEffect, useState} from "react";
import { UserAuth } from "../Context/AuthContext";

const Profile = () => {
    const { user } = UserAuth();
    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };

    checkAuthentication();
  }, [user]);

    return (
        <div className="p-4">
            {loading ? (<p>Loading...</p>) : user ? (<p>Welcome, {user.displayName}! You are logged into the profile.</p>) : (<p>Please login or create an account.</p>)}
        
        </div>
    )
}

export default Profile;