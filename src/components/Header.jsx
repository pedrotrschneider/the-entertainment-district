import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Settings, Moon, Sun } from 'lucide-react';
import useSettingsStore from '../store/settingsStore';
import './Header.css';

const Header = () => {
    const { theme, setTheme } = useSettingsStore();
    const location = useLocation();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <span className="logo-text">The Entertainment District</span>
                </Link>

                <div className="nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        Home
                    </Link>
                    <Link to="/discover" className={`nav-link ${location.pathname === '/discover' ? 'active' : ''}`}>
                        Discover
                    </Link>
                    <Link to="/search" className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}>
                        Search
                    </Link>
                    <Link to="/settings" className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}>
                        Settings
                    </Link>
                </div>

                <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
};

export default Header;
