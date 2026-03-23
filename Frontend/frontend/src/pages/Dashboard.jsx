import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [updates, setUpdates] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredUpdates, setFilteredUpdates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedMember, setSelectedMember] = useState('');
    const [notSubmitted, setNotSubmitted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [emailMsg, setEmailMsg] = useState('');
    const [reminderMsg, setReminderMsg] = useState('');

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/submit');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };

            const updatesRes = await axios.get(
                'http://localhost:3000/api/updates',
                { headers }
            );

            const usersRes = await axios.get(
                'http://localhost:3000/api/updates/users',
                { headers }
            );

            const todayRes = await axios.get(
                'http://localhost:3000/api/updates/today',
                { headers }
            );

            setUpdates(updatesRes.data);
            setFilteredUpdates(updatesRes.data);
            setUsers(usersRes.data);

            const submittedIds = todayRes.data.map(u => u.userId);
            const missing = usersRes.data.filter(
                u => !submittedIds.includes(u._id) && u.role === 'member'
            );
            setNotSubmitted(missing);

        } catch (error) {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = updates;

        if (selectedDate) {
            filtered = filtered.filter(u => {
                const updateDate = new Date(u.createdAt)
                    .toISOString().split('T')[0];
                return updateDate === selectedDate;
            });
        }

        if (selectedMember) {
            filtered = filtered.filter(u => u.name === selectedMember);
        }

        setFilteredUpdates(filtered);
    }, [selectedDate, selectedMember, updates]);

    const handleSendSummary = async () => {
        try {
            await axios.post(
                'http://localhost:3000/api/updates/send-summary',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEmailMsg('Summary email sent successfully ✓');
            setTimeout(() => setEmailMsg(''), 3000);
        } catch (err) {
            setEmailMsg(err.response?.data?.message || 'Failed to send email');
            setTimeout(() => setEmailMsg(''), 3000);
        }
    };

    const handleSendReminders = async () => {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/updates/send-reminders',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReminderMsg(res.data.message + ' ✓');
            setTimeout(() => setReminderMsg(''), 3000);
        } catch (err) {
            setReminderMsg(err.response?.data?.message || 'Failed to send reminders');
            setTimeout(() => setReminderMsg(''), 3000);
        }
    };

    const clearFilters = () => {
        setSelectedDate('');
        setSelectedMember('');
        setFilteredUpdates(updates);
    };

    const getUniqueMembers = () => {
        return [...new Set(updates.map(u => u.name))];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toDateString();
    };

    const hasBlocker = (blockers) => {
        return blockers &&
               blockers.toLowerCase() !== 'none' &&
               blockers.trim() !== '';
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div style={styles.loadingContainer}>
                    <p style={styles.loadingText}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={styles.container}>

                {notSubmitted.length > 0 && (
                    <div style={styles.missingBox}>
                        <p style={styles.missingTitle}>
                            Has not submitted today:
                        </p>
                        <div style={styles.missingNames}>
                            {notSubmitted.map(u => (
                                <span key={u._id} style={styles.missingBadge}>
                                    {u.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {notSubmitted.length === 0 && (
                    <div style={styles.allSubmittedBox}>
                        Everyone has submitted today ✓
                    </div>
                )}

                <div style={styles.buttonRow}>
                    <button
                        onClick={handleSendSummary}
                        style={styles.summaryBtn}
                    >
                        Send Summary Email
                    </button>
                    <button
                        onClick={handleSendReminders}
                        style={styles.reminderBtn}
                    >
                        Send Reminders
                    </button>
                </div>

                {emailMsg && (
                    <div style={styles.msgBox}>{emailMsg}</div>
                )}
                {reminderMsg && (
                    <div style={styles.msgBox}>{reminderMsg}</div>
                )}

                <div style={styles.filterRow}>
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Filter by date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={styles.filterInput}
                        />
                    </div>
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Filter by member</label>
                        <select
                            value={selectedMember}
                            onChange={(e) => setSelectedMember(e.target.value)}
                            style={styles.filterInput}
                        >
                            <option value="">All members</option>
                            {getUniqueMembers().map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>&nbsp;</label>
                        <button
                            onClick={clearFilters}
                            style={styles.clearBtn}
                        >
                            Clear filters
                        </button>
                    </div>
                </div>

                <div style={styles.statsRow}>
                    <div style={styles.statBox}>
                        <span style={styles.statNum}>{updates.length}</span>
                        <span style={styles.statLabel}>Total submissions</span>
                    </div>
                    <div style={styles.statBox}>
                        <span style={styles.statNum}>{filteredUpdates.length}</span>
                        <span style={styles.statLabel}>Showing now</span>
                    </div>
                    <div style={styles.statBox}>
                        <span style={styles.statNum}>
                            {filteredUpdates.filter(u => hasBlocker(u.blockers)).length}
                        </span>
                        <span style={styles.statLabel}>With blockers</span>
                    </div>
                </div>

                {filteredUpdates.length === 0 ? (
                    <div style={styles.emptyBox}>
                        No updates found for selected filters
                    </div>
                ) : (
                    filteredUpdates.map(update => (
                        <div key={update._id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div style={styles.cardLeft}>
                                    <span style={styles.memberName}>
                                        {update.name}
                                    </span>
                                    <span style={styles.cardDate}>
                                        {formatDate(update.createdAt)}
                                    </span>
                                </div>
                                <div style={styles.cardRight}>
                                    {hasBlocker(update.blockers) && (
                                        <span style={styles.blockerBadge}>
                                            Has blockers
                                        </span>
                                    )}
                                    {!hasBlocker(update.blockers) && (
                                        <span style={styles.clearBadge}>
                                            No blockers
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={styles.cardBody}>
                                <div style={styles.field}>
                                    <span style={styles.fieldLabel}>
                                        Completed work
                                    </span>
                                    <p style={styles.fieldValue}>
                                        {update.completedWork}
                                    </p>
                                </div>
                                <div style={styles.field}>
                                    <span style={styles.fieldLabel}>
                                        Objectives
                                    </span>
                                    <p style={styles.fieldValue}>
                                        {update.objectives}
                                    </p>
                                </div>
                                {hasBlocker(update.blockers) && (
                                    <div style={styles.field}>
                                        <span style={styles.blockerLabel}>
                                            Blockers
                                        </span>
                                        <p style={styles.blockerValue}>
                                            {update.blockers}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '32px 24px'
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh'
    },
    loadingText: {
        color: '#666',
        fontSize: '16px'
    },
    missingBox: {
        backgroundColor: '#fff8f0',
        border: '1px solid #fcd34d',
        borderRadius: '10px',
        padding: '16px 20px',
        marginBottom: '16px'
    },
    missingTitle: {
        margin: '0 0 10px 0',
        fontSize: '14px',
        fontWeight: '500',
        color: '#92400e'
    },
    missingNames: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
    },
    missingBadge: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '500'
    },
    allSubmittedBox: {
        backgroundColor: '#f0fff4',
        color: '#276749',
        padding: '14px 20px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '16px'
    },
    buttonRow: {
        display: 'flex',
        gap: '12px',
        marginBottom: '12px'
    },
    summaryBtn: {
        padding: '10px 20px',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer'
    },
    reminderBtn: {
        padding: '10px 20px',
        backgroundColor: '#0f6e56',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer'
    },
    msgBox: {
        backgroundColor: '#f0fff4',
        color: '#276749',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '12px'
    },
    filterRow: {
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        alignItems: 'flex-end'
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    filterLabel: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#555'
    },
    filterInput: {
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '13px',
        outline: 'none',
        minWidth: '160px'
    },
    clearBtn: {
        padding: '8px 16px',
        backgroundColor: 'transparent',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '13px',
        cursor: 'pointer',
        color: '#555'
    },
    statsRow: {
        display: 'flex',
        gap: '16px',
        marginBottom: '24px'
    },
    statBox: {
        backgroundColor: 'white',
        border: '1px solid #eee',
        borderRadius: '10px',
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        flex: 1
    },
    statNum: {
        fontSize: '28px',
        fontWeight: '600',
        color: '#4f46e5'
    },
    statLabel: {
        fontSize: '12px',
        color: '#888'
    },
    emptyBox: {
        textAlign: 'center',
        padding: '40px',
        color: '#888',
        fontSize: '15px',
        backgroundColor: 'white',
        borderRadius: '10px',
        border: '1px solid #eee'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '10px',
        border: '1px solid #eee',
        marginBottom: '16px',
        overflow: 'hidden'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 20px',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#fafafa'
    },
    cardLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    cardRight: {
        display: 'flex',
        alignItems: 'center'
    },
    memberName: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#1a1a1a'
    },
    cardDate: {
        fontSize: '12px',
        color: '#888'
    },
    blockerBadge: {
        backgroundColor: '#fff0f0',
        color: '#c0392b',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        border: '1px solid #fca5a5'
    },
    clearBadge: {
        backgroundColor: '#f0fff4',
        color: '#276749',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        border: '1px solid #9FE1CB'
    },
    cardBody: {
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    fieldLabel: {
        fontSize: '11px',
        fontWeight: '600',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    fieldValue: {
        margin: '0',
        fontSize: '14px',
        color: '#333',
        lineHeight: '1.5'
    },
    blockerLabel: {
        fontSize: '11px',
        fontWeight: '600',
        color: '#c0392b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    blockerValue: {
        margin: '0',
        fontSize: '14px',
        color: '#c0392b',
        lineHeight: '1.5'
    }
};

export default Dashboard;