//import "./Home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../Api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  // const [likesCount, setLikesCount] = useState(0);
  // const [isLiked, setIsLiked] = useState(false);

  const formatDate = (isodate) => {
    const date = new Date(isodate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const handleBlogs = async () => {
    try {
      const response = await axios.get(url + "posts/");
      setBlogs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const handleLikes = () => {
  //   if(isLiked) {
  //     setLikesCount(likesCount - 1);
  //     setIsLiked(false);
  //   } else {
  //     setLikesCount(likesCount + 1);
  //     setIsLiked(true);
  //   }
  // }

  useEffect(() => {
    handleBlogs();
  }, []);

  return (
    <div className="container py-5">
      {/* Popular Posts Section */}
      <div className="popular-container mb-5">
        <h2 className="text-center mb-4">Popular Posts</h2>
        <div className="d-flex overflow-auto">
          {blogs.map((blog) => (
            <div
              className="card me-3 shadow-sm hover-card border"
              key={blog.id}
              style={{ minWidth: "300px", flex: "0 0 auto", overflow: "hidden" }}
            >
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#2c3e50" }}>{blog.title}</h5>
                <p className="card-text">{blog.content}</p>
                <span className="d-block text-muted small mb-2">
                  {formatDate(blog.created_at)}
                </span>
                <span className="badge" style={{ backgroundColor: "#34495e", color: "white" }}>
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

      {/* Latest Posts Section */}
      <div className="latest-container mb-5">
        <h2 className="text-center mb-4">Latest Posts</h2>
        <div className="d-flex overflow-auto">
          {blogs.map((blog) => (
            <div
              className="card me-3 shadow-sm hover-card border"
              key={blog.id}
              style={{ minWidth: "300px", flex: "0 0 auto", overflow: "hidden" }}
            >
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#2c3e50" }}>{blog.title}</h5>
                <p className="card-text">{blog.content}</p>
                <span className="d-block text-muted small mb-2">
                  {new Date(blog.created_at).toLocaleDateString()}
                </span>
                <span className="badge" style={{ backgroundColor: "#34495e", color: "white" }}>
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
          <Marker position={[50.8503, 4.3517]}>
            <Popup>Brussels, Belgium</Popup>
          </Marker>
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
