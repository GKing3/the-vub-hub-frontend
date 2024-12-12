import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom"; // Hook to get URL parameters
import "./blogDetails.css";
import { AppContext } from "../../context/AppContext";

// const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API endpoint

const BlogDetails = () => {
  const { url } = useContext(AppContext);
  const { postId } = useParams(); // Get the post ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(url + `/${postId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBlog(data);
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
        blog && (
          <div className="post-detail">
            <h1 className="post-title">{blog.title}</h1>
            <p className="post-content">{blog.body}</p>
            <span className="post-date">{new Date().toLocaleDateString()}</span>
          </div>
        )
      )}
    </div>
  );
};

export default BlogDetails;
