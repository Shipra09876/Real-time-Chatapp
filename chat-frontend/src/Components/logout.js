import React from 'react';
import { log_out } from '../api/api';

function UserLogout({ onlogout }) {
    const handleLogout = async () => {
        const accessToken = sessionStorage.getItem("accessToken");
        const refreshToken = sessionStorage.getItem("refreshToken");

        if (!refreshToken) {
            alert("refresh token is missing , unable to logout!");
            return;
        }

        try {
            const response = await log_out(accessToken, refreshToken);
            alert("Logout successfully", response);

            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("refreshToken");

            if (onlogout) onlogout();
        } catch (error) {
            console.error(
                "Logout failed:",
                error.response?.data || error.message || "Unknown error"
            );
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <div>
            <button onClick={handleLogout} className='logout-button'>Logout</button>
        </div>
    );
}


export default UserLogout;