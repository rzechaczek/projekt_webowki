import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import '../Login/Auth.css';

export function RegisterPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Hasło musi mieć co najmniej 6 znaków');
            return;
        }

        setLoading(true);

        try {
            const data = await authApi.register({ email, username, password });
            login(data);
            navigate('/');
        } catch (err: any) {
            const msg = err.response?.data?.message;
            setError(
                Array.isArray(msg)
                    ? msg.join(', ')
                    : msg || 'Błąd podczas rejestracji',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card card">
                <div className="auth-logo">🍳</div>
                <h2 className="auth-title">Utwórz konto</h2>
                <p className="auth-subtitle">
                    Dołącz i zacznij zbierać ulubione przepisy
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Nazwa użytkownika</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="jankowalski"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={3}
                            autoComplete="username"
                        />
                    </div>

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
                        <label className="form-label">Hasło (min. 6 znaków)</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
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
                        {loading ? 'Rejestrowanie...' : 'Utwórz konto'}
                    </button>
                </form>

                <p className="auth-footer">
                    Masz już konto?{' '}
                    <Link to="/login" className="auth-link">
                        Zaloguj się
                    </Link>
                </p>
            </div>
        </div>
    );
}