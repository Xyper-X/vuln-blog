import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, MessageSquare } from 'lucide-react';

interface BlogCardProps {
  id: number;
  title: string;
  content: string;
  authorName: string;
  authorId: number;
  date: string;
  commentCount: number;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  content,
  authorName,
  authorId,
  date,
  commentCount
}) => {
  const truncatedContent = content.length > 150 
    ? content.substring(0, 150) + '...' 
    : content;

  return (
    <div className="blog-card bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg">
      <h2 className="text-2xl font-bold mb-2">
        <Link to={`/post/${id}`} className="text-blue-600 hover:text-blue-800">
          {title}
        </Link>
      </h2>
      
      <div className="flex items-center text-gray-500 mb-4 text-sm">
        <div className="flex items-center mr-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{date}</span>
        </div>
        <div className="flex items-center mr-4">
          <User className="h-4 w-4 mr-1" />
          <Link to={`/profile/${authorId}`} className="hover:text-blue-600">
            {authorName}
          </Link>
        </div>
        <div className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{truncatedContent}</p>
      
      <Link 
        to={`/post/${id}`}
        className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
      >
        Read more →
      </Link>
    </div>
  );
};

export default BlogCard