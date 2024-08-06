'use client';
import React, { useEffect, useState } from 'react';
import { UserAuth } from '../Context/AuthContext';

const Profile = () => {
    const { user } = UserAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setLoading(false);
        };

        checkAuthentication();
    }, [user]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>You must be logged in to view this page.</p>;
    }

    return (
        <div className="p-4">
            <div className="profile-header">

                <h3 className="profile-name">Welcome, {user.displayName}! You are logged in.</h3>
                <p className="profile-email">Email: {user.email}</p>
            </div>


            <div className="profile-recipes">
                <h2>My Recipes</h2>
                {/* List user's recipes here */}
            </div>

            


        </div>
    );
};

export default Profile;