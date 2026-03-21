import { useState } from 'react'
import client from '../api/client'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await client.post('/api/login', { email, password })
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            navigate('/dashboard')
        } catch (err) {
            setError('Invalid email or password!')
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={styles.title}>Smart CRM</h2>
                <p style={styles.subtitle}>Login to your account</p>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleLogin}>
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
                        Login
                    </button>
                </form>
                <p style={styles.link}>
                    Don't have an account?{' '}
                    <span
                        style={styles.linkText}
                        onClick={() => navigate('/register')}
                    >
                        Register here
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

export default Login