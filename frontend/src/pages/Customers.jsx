import { useState, useEffect } from 'react'
import client from '../api/client'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function Customers() {
    const [customers, setCustomers] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [company, setCompany] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            const response = await client.get('/api/customers', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCustomers(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    const exportPDF = () => {
        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.text('Smart CRM - Customers Report', 14, 22)
        doc.setFontSize(11)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32)
        autoTable(doc, {
            startY: 40,
            head: [['Name', 'Email', 'Phone', 'Company', 'Status']],
            body: customers.map(c => [
                c.name,
                c.email || '-',
                c.phone || '-',
                c.company || '-',
                c.status
            ]),
            styles: { fontSize: 10 },
            headStyles: { fillColor: [79, 70, 229] }
        })
        doc.save('customers-report.pdf')
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        try {
            await client.post('/api/customers',
                { name, email, phone, company },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setShowForm(false)
            setName(''); setEmail(''); setPhone(''); setCompany('')
            fetchCustomers()
        } catch (err) {
            setError('Failed to add customer!')
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await client.delete(`/api/customers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                fetchCustomers()
            } catch (err) {
                console.error(err)
            }
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.navbar}>
                <h2 style={styles.logo}>Smart CRM</h2>
                <div style={styles.navLinks}>
                    <span style={styles.navLink} onClick={() => navigate('/dashboard')}>Dashboard</span>
                    <span style={styles.navLinkActive}>Customers</span>
                    <span style={styles.navLink} onClick={() => navigate('/leads')}>Leads</span>
                    <span style={styles.navLink} onClick={() => navigate('/tasks')}>Tasks</span>
                </div>
                <button style={styles.logout} onClick={() => {
                    localStorage.clear()
                    navigate('/login')
                }}>Logout</button>
            </div>

            <div style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.heading}>Customers</h1>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={styles.exportBtn} onClick={exportPDF}>
                            Export PDF
                        </button>
                        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
                            + Add Customer
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div style={styles.form}>
                        <h3 style={styles.formTitle}>Add New Customer</h3>
                        {error && <p style={styles.error}>{error}</p>}
                        <form onSubmit={handleAdd}>
                            <input style={styles.input} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                            <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            <input style={styles.input} placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                            <input style={styles.input} placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
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
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Phone</th>
                                <th style={styles.th}>Company</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={styles.noData}>No customers yet! Add your first customer.</td>
                                </tr>
                            ) : (
                                customers.map(c => (
                                    <tr key={c.id} style={styles.tableRow}>
                                        <td style={styles.td}>{c.name}</td>
                                        <td style={styles.td}>{c.email}</td>
                                        <td style={styles.td}>{c.phone}</td>
                                        <td style={styles.td}>{c.company}</td>
                                        <td style={styles.td}>
                                            <span style={styles.badge}>{c.status}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <button style={styles.deleteBtn} onClick={() => handleDelete(c.id)}>Delete</button>
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
    exportBtn: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    cancelBtn: { backgroundColor: '#e5e7eb', color: '#333', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
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
    badge: { backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
    deleteBtn: { backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    noData: { textAlign: 'center', padding: '40px', color: '#999' }
}

export default Customers
