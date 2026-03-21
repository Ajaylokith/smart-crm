import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie,
    Cell, Legend
} from 'recharts'

function Dashboard() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')
    const [customerCount, setCustomerCount] = useState(0)
    const [leadCount, setLeadCount] = useState(0)
    const [taskCount, setTaskCount] = useState(0)
    const [leads, setLeads] = useState([])
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        fetchCounts()
    }, [])

    const fetchCounts = async () => {
        try {
            const customers = await client.get('/api/customers', {
                headers: { Authorization: `Bearer ${token}` }
            })
            const leadsRes = await client.get('/api/leads', {
                headers: { Authorization: `Bearer ${token}` }
            })
            const tasksRes = await client.get('/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCustomerCount(customers.data.length)
            setLeadCount(leadsRes.data.length)
            setTaskCount(tasksRes.data.length)
            setLeads(leadsRes.data)
            setTasks(tasksRes.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    const getLeadChartData = () => {
        const statuses = ['new', 'hot', 'won', 'lost']
        return statuses.map(s => ({
            name: s.toUpperCase(),
            count: leads.filter(l => l.status === s).length
        }))
    }

    const getTaskChartData = () => {
        const pending = tasks.filter(t => t.status === 'pending').length
        const completed = tasks.filter(t => t.status === 'completed').length
        return [
            { name: 'Pending', value: pending },
            { name: 'Completed', value: completed }
        ]
    }

    const getSummaryData = () => [
        { name: 'Customers', count: customerCount },
        { name: 'Leads', count: leadCount },
        { name: 'Tasks', count: taskCount }
    ]

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444']

    return (
        <div style={styles.container}>
            <div style={styles.navbar}>
                <h2 style={styles.logo}>Smart CRM</h2>
                <div style={styles.navLinks}>
                    <span style={styles.navLinkActive}>Dashboard</span>
                    <span style={styles.navLink} onClick={() => navigate('/customers')}>Customers</span>
                    <span style={styles.navLink} onClick={() => navigate('/leads')}>Leads</span>
                    <span style={styles.navLink} onClick={() => navigate('/tasks')}>Tasks</span>
                </div>
                <div style={styles.navRight}>
                    <span style={styles.welcome}>Welcome, {user ? user.name : 'User'}!</span>
                    <button style={styles.logout} onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div style={styles.content}>
                <h1 style={styles.heading}>Dashboard</h1>

                <div style={styles.cards}>
                    <div style={styles.card} onClick={() => navigate('/customers')}>
                        <h3 style={styles.cardTitle}>Customers</h3>
                        <p style={styles.cardNum}>{customerCount}</p>
                    </div>
                    <div style={styles.card} onClick={() => navigate('/leads')}>
                        <h3 style={styles.cardTitle}>Leads</h3>
                        <p style={styles.cardNum}>{leadCount}</p>
                    </div>
                    <div style={styles.card} onClick={() => navigate('/tasks')}>
                        <h3 style={styles.cardTitle}>Tasks</h3>
                        <p style={styles.cardNum}>{taskCount}</p>
                    </div>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Revenue</h3>
                        <p style={styles.cardNum}>₹0</p>
                    </div>
                </div>

                <div style={styles.chartsRow}>
                    <div style={styles.chartBox}>
                        <h3 style={styles.chartTitle}>Overall Summary</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={getSummaryData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#4f46e5" radius={[6,6,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={styles.chartBox}>
                        <h3 style={styles.chartTitle}>Leads by Status</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={getLeadChartData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" radius={[6,6,0,0]}>
                                    {getLeadChartData().map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={styles.chartBox}>
                        <h3 style={styles.chartTitle}>Tasks Status</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={getTaskChartData()}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label
                                >
                                    {getTaskChartData().map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
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
    navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    welcome: { color: 'white', fontSize: '14px' },
    logout: { backgroundColor: 'white', color: '#4f46e5', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    content: { padding: '32px' },
    heading: { color: '#1a1a2e', marginBottom: '24px' },
    cards: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' },
    card: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center', cursor: 'pointer' },
    cardTitle: { color: '#666', fontSize: '14px', marginBottom: '8px' },
    cardNum: { color: '#4f46e5', fontSize: '36px', fontWeight: 'bold', margin: 0 },
    chartsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
    chartBox: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
    chartTitle: { color: '#1a1a2e', fontSize: '16px', marginBottom: '16px', margin: '0 0 16px' }
}

export default Dashboard
