import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Hook to get URL parameters
import "./postDetails.css";

const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API endpoint

const PostDetail = () => {
  const { postId } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/${postId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <div className="post-detail-container">
      {loading ? (
        <p className="loading">Loading post...</p>
      ) : error ? (
        <p className="error">Error fetching post: {error}</p>
      ) : (
        post && (
          <div className="post-detail">
            <h1 className="post-title">{post.title}</h1>
            <p className="post-content">{post.body}</p>
            <span className="post-date">{new Date().toLocaleDateString()}</span>
          </div>
        )
      )}
    </div>
  );
};

export default PostDetail;
