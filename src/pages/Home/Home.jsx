import "./Home.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Link, useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const Home = () => {
  const {url} = useContext(AppContext);
  const [blogs, setBlogs] = useState([]);
  const [populairPosts, setPopulairPosts] = useState([]);

  const navigate = useNavigate();

  const formatDate = (isodate) => {
    const date = new Date(isodate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBlogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/posts/post-with-locations"
      );
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching posts with locations:", error);
    }
  };

  const handlePopularPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/posts/popular-posts"
      );
      setPopulairPosts(response.data);
    } catch (error) {
      console.error("Error fetching popular posts:", error);
    }
  };

  useEffect(() => {
    handleBlogs();
    handlePopularPosts();
  }, []);

  return (
    <div className="container py-5">
      {/* Popular Posts Section */}
      <div className="popular-container mb-4">
        <h2 className="text-center mb-4">Popular Posts</h2>
        <div className="d-flex overflow-auto scroll">
          {populairPosts.map((blog) => (
            <div
              className="card me-4 shadow-sm hover-card border"
              key={blog.id}
              style={{
                minWidth: "300px",
                flex: "0 0 auto",
                overflow: "hidden",
              }}
            >
              <div className="card-body">
                <img
                  src={blog.profile_img}
                  alt={`${blog.username}'s profile`}
                  className="rounded-circle me-2"
                  style={{ width: "30px", height: "30px", objectFit: "cover" }}
                />
                <span onClick={() => navigate(`/profile/${blog.user_id}`)} className="text-secondary fw-bold mb-4">
                  {blog.username}
                </span>
                <h5 className="card-title" style={{ color: "#2c3e50" }}>
                  {blog.title}
                </h5>
                <p className="card-text">{blog.content}</p>
                <Link to={`/blogs/${blog.id}`} className="read-more">
                  View post
                </Link>
                <span className="d-block text-muted small mb-2">
                  {formatDate(blog.created_at)}
                </span>
                <span
                  className="badge"
                  style={{ backgroundColor: "#34495e", color: "white" }}
                >
                  {blog.tags}
                </span>
              </div>
              {blog.image_url && (
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="card-img-bottom"
                  style={{ height: "200px", objectFit: "cover", width: "100%" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Latest Posts Section */}
      <div className="latest-container mb-5">
        <h2 className="text-center mb-4">Latest Posts</h2>
        <div className="d-flex overflow-auto">
          {blogs.slice(0, 10).map((blog) => (
            <div
              className="card me-4 shadow-sm hover-card border"
              key={blog.id}
              style={{
                minWidth: "300px",
                flex: "0 0 auto",
                overflow: "hidden",
              }}
            >
              <div className="card-body">
                <img
                  src={blog.profile_img}
                  alt={`${blog.username}'s profile`}
                  className="rounded-circle me-2"
                  style={{ width: "30px", height: "30px", objectFit: "cover" }}
                />
                <span onClick={() => navigate(`/profile/${blog.user_id}`)} className="text-secondary fw-bold">{blog.username}</span>
                <h5 className="card-title" style={{ color: "#2c3e50" }}>
                  {blog.title}
                </h5>
                <p className="card-text">{blog.content}</p>
                <Link to={`/blogs/${blog.id}`} className="read-more">
                  View post
                </Link>
                <span className="d-block text-muted small mb-2">
                  {formatDate(blog.created_at)}
                </span>
                <span
                  className="badge"
                  style={{ backgroundColor: "#34495e", color: "white" }}
                >
                  {blog.tags}
                </span>
              </div>
              {blog.image_url && (
                <img
                  src={blog.image_url}
                  alt={blog.title || "Blog Post"}
                  className="card-img-bottom"
                  style={{ height: "200px", objectFit: "cover", width: "100%" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="map-container mb-5">
        <h2 className="text-center mb-4">Explore the Map</h2>
        <MapContainer
          center={[50.8503, 4.3517]}
          zoom={13}
          style={{ height: "500px", borderRadius: "8px" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {blogs.map((blog) =>
            blog.location ? (
              <Marker
                key={blog.id}
                position={[blog.location.lat, blog.location.lng]}
                icon={L.icon({
                  iconUrl: blog.profile_img || "default-profile.png",
                  popupAnchor: [0, -40],
                  className: "custom-marker",
                })}
              >
                <Popup>
                  <div style={{ textAlign: "center" }}>
                    <strong
                      style={{
                        fontSize: "16px",
                        display: "block",
                        marginBottom: "10px",
                      }}
                    >
                      {blog.title}
                    </strong>
                    {blog.content && (
                      <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
                        {blog.content}
                      </p>
                    )}
                    {blog.image_url && (
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginTop: "10px", // Ruimte boven de afbeelding
                        }}
                      />
                    )}
                    <em
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        display: "block",
                        marginTop: "10px",
                      }}
                    >
                      - {blog.username}
                    </em>
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      <div className="hero-section text-center py-5 bg-light">
        <div className="hero-description">
          <h2> Discover, Share and Connect </h2>
          <p>
            Join a community of VUB students that value your input and are
            passionate about sharing knowledge, experiences and campus updates.
            <br />
            Start exploring or add your voice to the conversation.
          </p>
        </div>
        <button
          onClick={() => {
            navigate("/posts/");
            scrollTo(0, 0);
          }}
          className="btn btn-primary mt-3"
        >
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Home;
