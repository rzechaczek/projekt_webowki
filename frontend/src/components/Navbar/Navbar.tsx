import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="navbar">
        <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
    <span className="navbar-brand-icon">🍳</span>
    <span className="navbar-brand-text">Cookbook</span>
        </Link>

        <nav className="navbar-links">
    <NavLink
        to="/"
    end
    className={({ isActive }) =>
    `navbar-link ${isActive ? 'navbar-link--active' : ''}`
}
>
    Przepisy
    </NavLink>

    {isAuthenticated && (
        <>
            <NavLink
                to="/favorites"
        className={({ isActive }) =>
        `navbar-link ${isActive ? 'navbar-link--active' : ''}`
    }
    >
        Ulubione
        </NavLink>
        <NavLink
        to="/my-recipes"
        className={({ isActive }) =>
        `navbar-link ${isActive ? 'navbar-link--active' : ''}`
    }
    >
        Moje przepisy
    </NavLink>
    </>
    )}
    </nav>

    <div className="navbar-actions">
        {isAuthenticated ? (
                <>
                    <span className="navbar-username">{user?.username}</span>
        <button
    className="btn btn-secondary btn-sm"
    onClick={handleLogout}
        >
        Wyloguj
        </button>
        </>
) : (
        <>
            <Link to="/login" className="btn btn-secondary btn-sm">
        Zaloguj
        </Link>
        <Link to="/register" className="btn btn-primary btn-sm">
        Rejestracja
        </Link>
        </>
)}
    </div>
    </div>
    </header>
);
}