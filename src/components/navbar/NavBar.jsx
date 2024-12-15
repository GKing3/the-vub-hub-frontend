import "./navBar.css";
import {  useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import avatar_icon from "../../assets/avatar.png";
import { AppContext } from "../../context/AppContext";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
;
  const {userData, token, setToken, url} = useContext(AppContext);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = async (e) => {
    if(e.key === 'Enter') {
      const query = e.target.value;
      if(!query) return;

      // if(location.pathname === '/posts/') {
      //   const newSearch = `?tag=${query}`;
      //   if(location.search !== newSearch) {
      //     navigate({ pathname: location.pathname, search: newSearch });
      //   }
      // } else {
      //   navigate(`/posts/?tag=${query}`);
      // }

      try {
        const response = await axios.get(url + `posts/tag/${query}`);
        // console.log(response.data);
        setBlogs(response.data);

        if(location.pathname !== 'posts/') {
          navigate('posts/', {state: { blogs: response.data }});
        }
      } catch (error) {
        console.log(error);
      }
    }
  };


  const handleLogout = async () => {
    try {
        await axios.post('http://localhost:8000/auth/logout'); 
        setToken(false);
        sessionStorage.removeItem('userData');
        toast.success('Logged out successfully!', {
          onClose: () => {
            navigate("/");
          },
        });
    } catch (err) {
        toast.error('An error occurred while logging out.');
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
                placeholder="Search for blogs"
                onKeyDown={handleSearch}
              />
            </form>

            <div className="login">
              {userData ? (
                <div className="dropdown">
                  <img
                    src={avatar_icon}
                    alt="User profile avatar"
                    className="avatar"
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    style={{ cursor: "pointer" }}
                  />
                  {isDropdownOpen && (
                    <ul className="custom-dropdown">
                      <li onClick={() => navigate("my-profile")}>Profile</li>
                      <li onClick={() => navigate("my-blogs")}>My Blogs</li>
                      <li onClick={() => navigate("my-favourites")}>My Favourites</li>
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
