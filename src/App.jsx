import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Details from './pages/Details';
import Player from './pages/Player';
import Watchlist from './pages/Watchlist';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/media/:type/:id" element={<Details />} />
          <Route path="/player" element={<Player />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
