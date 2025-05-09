import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  date: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  date: string;
  comments: Comment[];
}

interface BlogContextType {
  posts: BlogPost[];
  addPost: (title: string, content: string) => void;
  getPostById: (id: string) => BlogPost | undefined;
  addComment: (postId: string, content: string) => void;
  deletePost: (id: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
}

const initialPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Welcome to our Blog',
    content: 'This is the first post of our new blog platform. We hope you enjoy your stay!',
    authorId: 1,
    authorName: 'admin',
    date: '2025-01-01',
    comments: [
      {
        id: 1,
        postId: 1,
        userId: 2,
        username: 'user1',
        content: 'Great first post!',
        date: '2025-01-02'
      }
    ]
  },
  {
    id: 2,
    title: 'Security Tips for Beginners',
    content: 'In this post, we will discuss some basic security practices that everyone should follow...',
    authorId: 1,
    authorName: 'admin',
    date: '2025-01-03',
    comments: []
  },
  {
    id: 3,
    title: 'My First Blog Post',
    content: 'Hello everyone! This is my first post on this platform. Looking forward to sharing more!',
    authorId: 2,
    authorName: 'user1',
    date: '2025-01-04',
    comments: [
      {
        id: 2,
        postId: 3,
        userId: 3,
        username: 'user2',
        content: 'Welcome to the platform!',
        date: '2025-01-05'
      }
    ]
  }
];

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const savedPosts = localStorage.getItem('blogPosts');
    return savedPosts ? JSON.parse(savedPosts) : initialPosts;
  });

  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
  }, [posts]);

  const addPost = (title: string, content: string) => {
    if (!currentUser) return;

    const newPost: BlogPost = {
      id: posts.length + 1,
      title,
      content,
      authorId: currentUser.id,
      authorName: currentUser.username,
      date: new Date().toISOString().split('T')[0],
      comments: []
    };

    setPosts([...posts, newPost]);
  };

  const getPostById = (id: number) => {
    return posts.find(post => post.id === id);
  };

  const addComment = (postId: number, content: string) => {
    if (!currentUser) return;

    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex === -1) return;

    const updatedPosts = [...posts];
    const newComment: Comment = {
      id: Math.max(0, ...updatedPosts[postIndex].comments.map(c => c.id)) + 1,
      postId,
      userId: currentUser.id,
      username: currentUser.username,
      content,
      date: new Date().toISOString().split('T')[0]
    };

    updatedPosts[postIndex].comments.push(newComment);
    setPosts(updatedPosts);
  };

  const deletePost = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const deleteComment = (postId: number, commentId: number) => {
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex === -1) return;

    const updatedPosts = [...posts];
    updatedPosts[postIndex].comments = updatedPosts[postIndex].comments.filter(
      comment => comment.id !== commentId
    );

    setPosts(updatedPosts);
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        addPost,
        getPostById,
        addComment,
        deletePost,
        deleteComment
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};