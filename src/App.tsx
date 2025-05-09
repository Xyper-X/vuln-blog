import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogPost from './pages/BlogPost';
import CreatePost from './pages/CreatePost';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import './App.css';
import SecretDashboard from './pages/SecretDashboard';
import DirFlag from './pages/flag';



function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/post/:id" element={<BlogPost />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/secret-dashboard" element={<SecretDashboard />} />
                <Route path="/secret-dashboard/directory-flag" element={<DirFlag />} />
              </Routes>
            </div>
          </div>
        </Router>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;