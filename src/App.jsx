import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Details from './pages/Details';
import Settings from './pages/Settings';
import Discover from './pages/Discover';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="app">
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/search" element={<Search />} />
              <Route path="/media/:type/:id" element={<Details />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
