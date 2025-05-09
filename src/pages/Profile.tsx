import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { User, Mail, Shield, Calendar, FileText } from 'lucide-react';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0');
  const { getUserById, currentUser } = useAuth();
  const { posts } = useBlog();
  
  // Only allow users to view their own profile or admin to view any profile
  if (!currentUser || (currentUser.id !== userId && !currentUser.isAdmin)) {
    return <Navigate to="/" replace />;
  }
  
  const user = getUserById(userId);
  
  if (!user) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <p className="mb-4">The user you're looking for doesn't exist.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }
  
  const userPosts = posts.filter(post => post.authorId === userId);
  const canViewSensitiveInfo = currentUser && (currentUser.id === userId || currentUser.isAdmin);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-600 text-white p-4 rounded-full mr-4">
            <User className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            {user.isAdmin && (
              <div className="flex items-center text-blue-600 mt-1">
                <Shield className="h-4 w-4 mr-1" />
                <span>Administrator</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <User className="h-5 w-5 text-gray-500 mr-2" />
                <span>Username: {user.username}</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 mr-2" />
                <span>Email: {user.email}</span>
              </li>
              {canViewSensitiveInfo && (
                <li className="flex items-center text-red-600">
                  <Shield className="h-5 w-5 mr-2" />
                  <span>Password: {user.password}</span>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Activity</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                <span>Posts: {userPosts.length}</span>
              </li>
              <li className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <span>Joined: 2025-01-01</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-6">Posts by {user.username}</h2>
        {userPosts.length === 0 ? (
          <p className="text-gray-500 italic">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {userPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">
                  <Link to={`/post/${post.id}`} className="text-blue-600 hover:text-blue-800">
                    {post.title}
                  </Link>
                </h3>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                </div>
                <p className="text-gray-700">
                  {post.content.length > 150 
                    ? post.content.substring(0, 150) + '...' 
                    : post.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile