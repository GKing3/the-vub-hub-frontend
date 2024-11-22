import { useState, useEffect } from "react";
import "./myBlogs.css";
import { Link } from "react-router-dom";

const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API endpoint

const MyBlogs = () => {
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage errors

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Filter posts to simulate "My Blogs" (e.g., filter by userId)
        const userPosts = data.filter((post) => post.userId === 1); // Example userId: 1
        setPosts(userPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="posts-container">
      <h1 className="header">My Posts</h1>
      {loading ? (
        <p className="loading">Loading your posts...</p>
      ) : error ? (
        <p className="error">Error fetching posts: {error}</p>
      ) : posts.length === 0 ? (
        <p className="no-posts">You have not created any posts yet.</p>
      ) : (
        <ul className="posts-list">
          {posts.map((post) => (
            <li key={post.id} className="post-item">
              <h2 className="post-title">{post.title}</h2>
              <p className="post-content">
                {post.body.length > 100
                  ? `${post.body.substring(0, 100)}...`
                  : post.body}
              </p>
              <Link to={`/post-detail/${post.id}`} className="read-more">
                Read More
              </Link>
              <span className="post-date">
                {/* Simulating a post date */}
                {new Date().toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBlogs;
