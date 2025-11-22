import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import useSettingsStore from '../store/settingsStore';
import './Layout.css';

const Layout = ({ children }) => {
    const { theme } = useSettingsStore();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div className="layout">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
