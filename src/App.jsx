import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import Home from './pages/Home';
import Search from './pages/Search';
import Details from './pages/Details';
import Settings from './pages/Settings';
import Discover from './pages/Discover';
import Downloads from './pages/Downloads';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const backButtonListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (location.pathname === '/') {
          CapacitorApp.exitApp();
        } else {
          navigate(-1);
        }
      });

      return () => {
        backButtonListener.then(listener => listener.remove());
      };
    }
  }, [navigate, location]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/search" element={<Search />} />
        <Route path="/media/:type/:id" element={<Details />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="app">
          <AppContent />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
