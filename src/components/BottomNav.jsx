import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Settings, Compass, Download } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bottom-nav">
            <Link to="/" className={`bottom-nav-item bottom-nav-item-home ${isActive('/') ? 'active' : ''}`}>
                <Home size={24} />
                <span>Home</span>
            </Link>
            <Link to="/search" className={`bottom-nav-item bottom-nav-item-search ${isActive('/search') ? 'active' : ''}`}>
                <Search size={24} />
                <span>Search</span>
            </Link>
            <Link to="/discover" className={`bottom-nav-item bottom-nav-item-discover ${isActive('/discover') ? 'active' : ''}`}>
                <Compass size={24} />
                <span>Discover</span>
            </Link>
            <Link to="/downloads" className={`bottom-nav-item bottom-nav-item-downloads ${isActive('/downloads') ? 'active' : ''}`}>
                <Download size={24} />
                <span>Downloads</span>
            </Link>
            <Link to="/settings" className={`bottom-nav-item bottom-nav-item-settings ${isActive('/settings') ? 'active' : ''}`}>
                <Settings size={24} />
                <span>Settings</span>
            </Link>
        </nav>
    );
};

export default BottomNav;
