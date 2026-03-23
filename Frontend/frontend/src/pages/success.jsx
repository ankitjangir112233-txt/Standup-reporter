import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.checkmark}>✓</div>
                <h2 style={styles.title}>Thank you for submitting!</h2>
                <p style={styles.text}>
                    Your daily standup has been recorded successfully.
                </p>
                <p style={styles.subtext}>
                    See you tomorrow!
                </p>
                <button
                    style={styles.button}
                    onClick={() => navigate('/submit')}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5'
    },
    card: {
        backgroundColor: 'white',
        padding: '60px 40px',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
    },
    checkmark: {
        fontSize: '48px',
        color: '#276749',
        backgroundColor: '#f0fff4',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px auto'
    },
    title: {
        margin: '0 0 12px 0',
        fontSize: '22px',
        color: '#1a1a1a'
    },
    text: {
        margin: '0 0 8px 0',
        color: '#444',
        fontSize: '15px'
    },
    subtext: {
        margin: '0 0 32px 0',
        color: '#888',
        fontSize: '14px'
    },
    button: {
        padding: '10px 28px',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer'
    }
};

export default Success;