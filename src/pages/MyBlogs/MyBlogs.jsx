import { useState, useEffect, useContext } from "react";
import "./myBlogs.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const API_URL = "http://localhost:8000"; // Backend URL

const MyBlogs = () => {
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const { userData } = useContext(AppContext);

  // fetching created posts of the logged-in user
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          API_URL + `/posts/user/${userData.id}`
        );
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching created posts:", err);
      }
    };
    fetchPosts();
  }, []); // Is only run once, when mounting the page

  return (
    <div className="posts-container">
      <h1 className="header">My Posts</h1>
      {posts.length === 0 ? (
        <p className="no-posts">You have not created any posts yet.</p>
      ) : (
        <ul className="posts-list">
          {posts.map((post) => (
            <li key={post.id} className="post-item">
              <img
                className="author-profile-pic"
                src={userData.image_profile_url}
                alt={`${userData.name}'s profile`}
              />
              <h2 className="post-title">{post.title}</h2>
              <p className="post-content">
                {post.content.length > 100
                  ? `${post.content.substring(0, 100)}...`
                  : post.content}
              </p>
              <Link to={`/blogs/${post.id}`} className="read-more">
                Read More
              </Link>
              <span className="post-date">
                Posted on: {new Date(post.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBlogs;
