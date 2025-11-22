import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Details from './pages/Details';
import Player from './pages/Player';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/media/:type/:id" element={<Details />} />
            <Route path="/player" element={<Player />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;
