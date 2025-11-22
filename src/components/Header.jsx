import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Settings, Moon, Sun, Compass, Download } from 'lucide-react';
import useSettingsStore from '../store/settingsStore';
import './Header.css';

const Header = () => {
    const { theme, setTheme } = useSettingsStore();
    const location = useLocation();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const isActive = (path) => location.pathname === path;

    // Determine logo color based on current page
    const getLogoClass = () => {
        if (location.pathname === '/search') return 'logo-search';
        if (location.pathname === '/discover') return 'logo-discover';
        if (location.pathname === '/downloads') return 'logo-downloads';
        if (location.pathname === '/settings') return 'logo-settings';
        return 'logo-home'; // Default/Home
    };

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <span className={`logo-text ${getLogoClass()}`}>The Entertainment District</span>
                </Link>

                <div className="nav-links">
                    <Link to="/search" className={`nav-item nav-item-search ${isActive('/search') ? 'active' : ''}`}>
                        <Search size={20} />
                        <span>Search</span>
                    </Link>
                    <Link to="/" className={`nav-item nav-item-home ${isActive('/') ? 'active' : ''}`}>
                        <Home size={20} />
                        <span>Home</span>
                    </Link>
                    <Link to="/discover" className={`nav-item nav-item-discover ${isActive('/discover') ? 'active' : ''}`}>
                        <Compass size={20} />
                        <span>Discover</span>
                    </Link>
                    <Link to="/downloads" className={`nav-item nav-item-downloads ${isActive('/downloads') ? 'active' : ''}`}>
                        <Download size={20} />
                        <span>Downloads</span>
                    </Link>
                    <Link to="/settings" className={`nav-item nav-item-settings ${isActive('/settings') ? 'active' : ''}`}>
                        <Settings size={20} />
                        <span>Settings</span>
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
