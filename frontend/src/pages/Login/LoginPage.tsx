import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authApi.login({ email, password });
            login(data);
            navigate('/');
        } catch (err: any) {
            const msg = err.response?.data?.message;
            setError(
                Array.isArray(msg)
                    ? msg.join(', ')
                    : msg || 'Nieprawidłowy email lub hasło',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card card">
                <div className="auth-logo">🍳</div>
                <h2 className="auth-title">Zaloguj się</h2>
                <p className="auth-subtitle">Wróć do swoich ulubionych przepisów</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="email@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Hasło</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="alert alert-error" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                    >
                        {loading ? 'Logowanie...' : 'Zaloguj się'}
                    </button>
                </form>

                <p className="auth-footer">
                    Nie masz konta?{' '}
                    <Link to="/register" className="auth-link">
                        Zarejestruj się
                    </Link>
                </p>
            </div>
        </div>
    );
}