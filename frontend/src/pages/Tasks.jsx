import { useState, useEffect } from 'react'
import client from '../api/client'
import { useNavigate } from 'react-router-dom'

function Tasks() {
    const [tasks, setTasks] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState('')
    const [priority, setPriority] = useState('medium')
    const [status, setStatus] = useState('pending')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const response = await client.get('/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTasks(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        try {
            await client.post('/api/tasks',
                { title, priority, status },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setShowForm(false)
            setTitle(''); setPriority('medium'); setStatus('pending')
            fetchTasks()
        } catch (err) {
            setError('Failed to add task!')
        }
    }

    const handleComplete = async (id) => {
        try {
            await client.put(`/api/tasks/${id}`,
                { status: 'completed' },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchTasks()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await client.delete(`/api/tasks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                fetchTasks()
            } catch (err) {
                console.error(err)
            }
        }
    }

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return { bg: '#fee2e2', color: '#dc2626' }
            case 'medium': return { bg: '#fef9c3', color: '#ca8a04' }
            case 'low': return { bg: '#dcfce7', color: '#16a34a' }
            default: return { bg: '#fef9c3', color: '#ca8a04' }
        }
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return { bg: '#e0f2fe', color: '#0369a1' }
            case 'completed': return { bg: '#dcfce7', color: '#16a34a' }
            default: return { bg: '#e0f2fe', color: '#0369a1' }
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.navbar}>
                <h2 style={styles.logo}>Smart CRM</h2>
                <div style={styles.navLinks}>
                    <span style={styles.navLink} onClick={() => navigate('/dashboard')}>Dashboard</span>
                    <span style={styles.navLink} onClick={() => navigate('/customers')}>Customers</span>
                    <span style={styles.navLink} onClick={() => navigate('/leads')}>Leads</span>
                    <span style={styles.navLinkActive}>Tasks</span>
                </div>
                <button style={styles.logout} onClick={() => {
                    localStorage.clear()
                    navigate('/login')
                }}>Logout</button>
            </div>

            <div style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.heading}>Tasks</h1>
                    <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
                        + Add Task
                    </button>
                </div>

                {showForm && (
                    <div style={styles.form}>
                        <h3 style={styles.formTitle}>Add New Task</h3>
                        {error && <p style={styles.error}>{error}</p>}
                        <form onSubmit={handleAdd}>
                            <input
                                style={styles.input}
                                placeholder="Task Title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                            <select style={styles.input} value={priority} onChange={e => setPriority(e.target.value)}>
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            <select style={styles.input} value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                            <div style={styles.formBtns}>
                                <button style={styles.addBtn} type="submit">Save</button>
                                <button style={styles.cancelBtn} type="button" onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div style={styles.tableWrap}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHead}>
                                <th style={styles.th}>Title</th>
                                <th style={styles.th}>Priority</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={styles.noData}>No tasks yet! Add your first task.</td>
                                </tr>
                            ) : (
                                tasks.map(t => (
                                    <tr key={t.id} style={styles.tableRow}>
                                        <td style={{
                                            ...styles.td,
                                            textDecoration: t.status === 'completed' ? 'line-through' : 'none',
                                            color: t.status === 'completed' ? '#999' : '#333'
                                        }}>{t.title}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                backgroundColor: getPriorityColor(t.priority).bg,
                                                color: getPriorityColor(t.priority).color,
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>{t.priority.toUpperCase()}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                backgroundColor: getStatusColor(t.status).bg,
                                                color: getStatusColor(t.status).color,
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>{t.status.toUpperCase()}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{display: 'flex', gap: '8px'}}>
                                                {t.status !== 'completed' && (
                                                    <button style={styles.completeBtn} onClick={() => handleComplete(t.id)}>
                                                        Complete
                                                    </button>
                                                )}
                                                <button style={styles.deleteBtn} onClick={() => handleDelete(t.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
    navbar: { backgroundColor: '#4f46e5', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { color: 'white', margin: 0 },
    navLinks: { display: 'flex', gap: '24px' },
    navLink: { color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '14px' },
    navLinkActive: { color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', borderBottom: '2px solid white', paddingBottom: '4px' },
    logout: { backgroundColor: 'white', color: '#4f46e5', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    content: { padding: '32px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    heading: { color: '#1a1a2e', margin: 0 },
    addBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    cancelBtn: { backgroundColor: '#e5e7eb', color: '#333', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    completeBtn: { backgroundColor: '#dcfce7', color: '#16a34a', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    deleteBtn: { backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    form: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
    formTitle: { margin: '0 0 16px', color: '#1a1a2e' },
    formBtns: { display: 'flex', gap: '12px', marginTop: '8px' },
    input: { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    error: { color: 'red', marginBottom: '12px' },
    tableWrap: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHead: { backgroundColor: '#f8f9fa' },
    th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: '600', borderBottom: '1px solid #eee' },
    tableRow: { borderBottom: '1px solid #f0f0f0' },
    td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
    noData: { textAlign: 'center', padding: '40px', color: '#999' }
}

export default Tasks