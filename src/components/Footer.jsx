import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} The Entertainment District. All rights reserved.</p>
                <p className="footer-note">Inspired by Kimetsu no Yaiba</p>
            </div>
        </footer>
    );
};

export default Footer;
