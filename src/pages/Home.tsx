import React from 'react';
import { useBlog } from '../context/BlogContext';
import BlogCard from '../components/BlogCard';

const Home: React.FC = () => {
  const { posts } = useBlog();
  
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Recent Blog Posts</h1>
      
      {sortedPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">No posts yet. Be the first to create a post!</p>
        </div>
      ) : (
        <div>
          {sortedPosts.map(post => (
            <BlogCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              authorName={post.authorName}
              authorId={post.authorId}
              date={post.date}
              commentCount={post.comments.length}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home