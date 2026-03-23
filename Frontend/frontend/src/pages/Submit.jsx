import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Submit = () => {
    const [completedWork, setCompletedWork] = useState('');
    const [objectives, setObjectives] = useState('');
    const [blockers, setBlockers] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const checkSubmission = async () => {
            try {
                const res = await axios.get(
                    'http://localhost:3000/api/updates/mine',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.submitted) {
                    setAlreadySubmitted(true);
                }
            } catch (err) {
                // silently fail
            }
        };
        checkSubmission();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post(
                'http://localhost:3000/api/updates',
                { completedWork, objectives, blockers },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            navigate('/success');

        } catch (err) {
            const errMsg = err.response?.data?.message || 'Submission failed';
            setError(errMsg);
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Daily Standup</h2>
                    <p style={styles.subtitle}>{new Date().toDateString()}</p>

                    {alreadySubmitted ? (
                        <div style={styles.successBox}>
                            You have already submitted your standup today ✓
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>

                            {error && (
                                <div style={styles.errorBox}>
                                    {error}
                                </div>
                            )}

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    What did you complete?
                                </label>
                                <textarea
                                    value={completedWork}
                                    onChange={(e) => setCompletedWork(e.target.value)}
                                    style={styles.textarea}
                                    placeholder="Describe what you finished..."
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    What are your objectives today?
                                </label>
                                <textarea
                                    value={objectives}
                                    onChange={(e) => setObjectives(e.target.value)}
                                    style={styles.textarea}
                                    placeholder="Describe what you plan to do..."
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    Any blockers?
                                </label>
                                <textarea
                                    value={blockers}
                                    onChange={(e) => setBlockers(e.target.value)}
                                    style={styles.textarea}
                                    placeholder="None"
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    ...styles.button,
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Standup'}
                            </button>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '560px',
        height: 'fit-content'
    },
    title: {
        margin: '0 0 4px 0',
        fontSize: '22px',
        color: '#1a1a1a'
    },
    subtitle: {
        margin: '0 0 24px 0',
        color: '#666',
        fontSize: '14px'
    },
    inputGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '6px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#333'
    },
    textarea: {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        minHeight: '90px',
        resize: 'vertical',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit'
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '500'
    },
    errorBox: {
        backgroundColor: '#fff0f0',
        color: '#c0392b',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px'
    },
    successBox: {
        backgroundColor: '#f0fff4',
        color: '#276749',
        padding: '24px',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '500',
        textAlign: 'center'
    }
};

export default Submit;