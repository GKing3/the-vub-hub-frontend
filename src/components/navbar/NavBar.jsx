import "./navBar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import avatar_icon from "../../assets/avatar.png";
import { AppContext } from "../../context/AppContext";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {userData,setUserData, token, setToken, url} = useContext(AppContext);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);


  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const zoek = e.target.value;
      if (!zoek) return;
      try {
        const response = await axios.get('http://localhost:8000/search',{params: {
          query: zoek
        }
        });
        const { users, threads, posts } = response.data.results;
        navigate("/search-results", { state: { users, threads, posts } });
      } catch (error) {
        console.error("Search failed:", error);
        toast.error("An error occurred during the search.");
      }
    }
  };



  const handleLogout = async () => {
    try {
        const res = await axios.post('http://localhost:8000/auth/logout'); 
        setDropdownOpen(false);
        setToken(false);
        sessionStorage.removeItem('userData');
        setUserData(false);
        navigate("/");
    
    } catch (err) {
      toast.error("An error occurred while logging out.");
    }
  };

  return (
    <body>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand site-name" href="/">
            The VUB Hub
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Threads">
                  Threads
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/news">
                  News
                </a>
              </li>
            </ul>
            <form className="d-flex mx-auto">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                onKeyDown={handleSearch}
              />
            </form>

            <div className="login">
              {userData ? (
                <div className="dropdown">
                  <img
                    src={userData.image_profile_url || avatar_icon}
                    alt="User profile avatar"
                    className="avatar"
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    style={{ cursor: "pointer" }}
                  />
                  {isDropdownOpen && (
                    <ul className="custom-dropdown">
                      <li onClick={() => navigate("my-profile")}>Profile</li>
                      <li onClick={() => navigate("my-blogs")}>My Blogs</li>
                      <li onClick={() => navigate("my-favourites")}>
                        My Favourites
                      </li>
                      <li onClick={handleLogout}>Logout</li>
                    </ul>
                  )}
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/register")}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </body>
  );
};

export default NavBar;
