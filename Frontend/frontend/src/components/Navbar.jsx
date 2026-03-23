import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div style={styles.navbar}>
            <span style={styles.brand}>Standup Reporter</span>
            <div style={styles.right}>
                <span style={styles.name}>
                    {user?.name}
                </span>
                <button
                    onClick={handleLogout}
                    style={styles.logout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 28px',
        backgroundColor: 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
    },
    brand: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#4f46e5'
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    name: {
        fontSize: '14px',
        color: '#333'
    },
    logout: {
        padding: '7px 16px',
        backgroundColor: 'transparent',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '13px',
        cursor: 'pointer',
        color: '#555'
    }
};

export default Navbar;
