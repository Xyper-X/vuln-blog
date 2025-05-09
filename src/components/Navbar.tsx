import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, PenSquare, LogOut, Home } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <PenSquare className="mr-2" />
            <span>VulnBlog</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 flex items-center">
              <Home className="mr-1 h-5 w-5" />
              <span>Home</span>
            </Link>
            
            {currentUser ? (
              <>
                <Link to="/create" className="hover:text-blue-200 flex items-center">
                  <PenSquare className="mr-1 h-5 w-5" />
                  <span>New Post</span>
                </Link>
                
                <Link to={`/profile/${currentUser.id}`} className="hover:text-blue-200 flex items-center">
                  <User className="mr-1 h-5 w-5" />
                  <span>{currentUser.username}</span>
                </Link>
                
                {currentUser.isAdmin && (
                  <Link to="/admin" className="hover:text-blue-200 flex items-center">
                    <Shield className="mr-1 h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="hover:text-blue-200 flex items-center"
                >
                  <LogOut className="mr-1 h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="hover:text-blue-200">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar