import { useState } from 'react'
import client from '../api/client'
import { useNavigate } from 'react-router-dom'

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            await client.post('/api/register', { name, email, password })
            setSuccess('Registered successfully! Please login.')
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setError('Registration failed! Email may already exist.')
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={styles.title}>Smart CRM</h2>
                <p style={styles.subtitle}>Create your account</p>
                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}
                <form onSubmit={handleRegister}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button style={styles.button} type="submit">
                        Register
                    </button>
                </form>
                <p style={styles.link}>
                    Already have an account?{' '}
                    <span
                        style={styles.linkText}
                        onClick={() => navigate('/login')}
                    >
                        Login here
                    </span>
                </p>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5'
    },
    box: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '380px'
    },
    title: {
        textAlign: 'center',
        color: '#1a1a2e',
        fontSize: '28px',
        marginBottom: '8px'
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '24px'
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '16px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        boxSizing: 'border-box'
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '8px'
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '16px'
    },
    success: {
        color: 'green',
        textAlign: 'center',
        marginBottom: '16px'
    },
    link: {
        textAlign: 'center',
        marginTop: '16px',
        color: '#666'
    },
    linkText: {
        color: '#4f46e5',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
}

export default Register