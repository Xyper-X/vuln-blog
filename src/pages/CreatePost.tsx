import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { PenSquare } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';


const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { addPost } = useBlog();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPost = {
      id: uuidv4(),
      title,
      content,
      authorId: currentUser?.id || uuidv4(),
      authorName: currentUser?.username || 'Anonymous',
      date: new Date().toISOString(),
      comments: [],
    };

    addPost(newPost);
    navigate('/');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <PenSquare className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold">Create New Post</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="vulnerable-input w-full px-4 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              rows={10}
              className="vulnerable-input w-full px-4 py-2 rounded"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your post content here... HTML is supported for formatting."
            ></textarea>
            <div className="text-gray-400 text-xs mt-1">
              Hint: Try adding HTML or script tags for formatting or XSS
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;