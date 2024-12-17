import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Posts.css";

const FollowedPost = () => {
  const { userData } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [Followedposts, setFollowedposts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [populairPosts, setPopulairPosts] = useState([]);

  const formatDate = (isodate) => {
    const date = new Date(isodate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  useEffect(() => {
    const fetchFollowedPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/posts/followed-posts");
        setFollowedposts(response.data.posts);
      } catch (error) {
        console.error("Error fetching followed posts:", error);
      }
    };

    const handlePopularPosts = async () => {
      try {
          const response = await axios.get("http://localhost:8000/posts/popular-posts");
          setPopulairPosts(response.data);
      } catch (error) {
          console.error("Error fetching popular posts:", error);
      }
    };

      const handleBlogs = async () => {
        try {
          const response = await axios.get("http://localhost:8000/posts/post-with-locations");
          setPosts(response.data);
        } catch (error) {
          console.error("Error fetching posts with locations:", error);
        }
      }; 

    if (userData) {
      fetchFollowedPosts();
    }
    handlePopularPosts();
    handleBlogs();
  }, [userData]);
  


  useEffect(() => {
    let filtered = posts;
    if (filter === "popular") {
      filtered = populairPosts; 
    } else if (filter === "withImage") {
      filtered = posts.filter((post) => post.image_url);
    } else if (filter === "withTags") {
      filtered = posts.filter((post) => post.tags && post.tags.length > 0); 
    } else if (filter === "followed"){
      filtered = Followedposts; 
    }
    setFilteredPosts(filtered);
  }, [filter, posts]);

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-md-3 mb-4">
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Posts
            </button>
            <button
              className={`list-group-item list-group-item-action ${filter === "followed" ? "active" : ""}`}
              onClick={() => setFilter("followed")}
            >
              Followed Posts 
            </button>
            <button
              className={`list-group-item list-group-item-action ${filter === "popular" ? "active" : ""}`}
              onClick={() => setFilter("popular")}
            >
              Popular Posts
            </button>
            <button
              className={`list-group-item list-group-item-action ${filter === "withImage" ? "active" : ""}`}
              onClick={() => setFilter("withImage")}
            >
              Posts with Images
            </button>
            <button
              className={`list-group-item list-group-item-action ${filter === "withTags" ? "active" : ""}`}
              onClick={() => setFilter("withTags")}
            >
              Posts with Tags
            </button>
          </div>
        </div>

        {/* Posts Content */}
        <div className="col-md-9">
          <div className="row">
            {filteredPosts.slice(0,50).length === 0 ? (
              <p className="text-center">No posts to display.</p>
            ) : (
              filteredPosts.map((post) => (
                <div className="col-md-6 mb-4" key={post.id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-header d-flex align-items-center">
                      <img
                        src={post.profile_img}
                        className="rounded-circle me-2"
                        alt={post.username}
                        style={{ width: "40px", height: "40px" }}
                      />
                      <span>{post.username}</span>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title mb-3">{post.title}</h5>
                      <p className="card-text flex-grow-1 mb-3">{post.content}</p>
                    </div>
                    <Link to={`/blogs/${post.id}`} className="read-more">
                       View post
                    </Link>
                    <span className="d-block text-muted small mb-2">
                      {formatDate(post.created_at)}
                    </span>
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        className="img-fluid w-100"
                        alt={post.title}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ToastContainer transition={toast.Bounce} />
    </div>
  );
};

export default FollowedPost;
