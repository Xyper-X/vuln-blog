import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, MessageSquare, Trash2 } from 'lucide-react';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id || '0');
  const { getPostById, addComment, deletePost, deleteComment } = useBlog();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [commentContent, setCommentContent] = useState('');
  
  const post = getPostById(postId);
  
  if (!post) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <p className="mb-4">The post you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    
    addComment(postId, commentContent);
    setCommentContent('');
  };
  
  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
      navigate('/');
    }
  };
  
  const handleDeleteComment = (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(postId, commentId);
    }
  };
  
  const canModifyPost = currentUser && (currentUser.id === post.authorId || currentUser.isAdmin);

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center text-gray-500 mb-6 text-sm">
          <div className="flex items-center mr-4">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <Link to={`/profile/${post.authorId}`} className="hover:text-blue-600">
              {post.authorName}
            </Link>
          </div>
        </div>
        
        <div className="prose max-w-none mb-6">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
        
        {canModifyPost && (
          <div className="flex justify-end">
            <button
              onClick={handleDeletePost}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span>Delete Post</span>
            </button>
          </div>
        )}
      </article>
      
      <div className="comment-section rounded-lg shadow-md p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          <span>Comments ({post.comments.length})</span>
        </h2>
        
        {currentUser ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-700 mb-2">
                Add a comment
              </label>
              <textarea
                id="comment"
                rows={3}
                className="w-full px-4 py-2 rounded border border-gray-300"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your thoughts..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-blue-50 rounded">
            <p>
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>{' '}
              or{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>{' '}
              to add a comment.
            </p>
          </div>
        )}
        
        {post.comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-6">
            {post.comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Link
                      to={`/profile/${comment.userId}`}
                      className="font-semibold text-blue-600 hover:underline mr-2"
                    >
                      {comment.username}
                    </Link>
                    <span className="text-gray-500 text-sm">{comment.date}</span>
                  </div>
                  {(currentUser?.id === comment.userId || currentUser?.isAdmin) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPost