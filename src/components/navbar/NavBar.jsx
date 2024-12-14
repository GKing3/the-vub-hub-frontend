import "./navBar.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import search_icon from "../../assets/search.png";
import avatar_icon from "../../assets/avatar.png";
import { AppContext } from "../../context/AppContext";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, token, setToken } = useContext(AppContext);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value;

      if (location.pathname === "/posts/") {
        const newSearch = `?tag=${query}`;
        if (location.search !== newSearch) {
          navigate({ pathname: location.pathname, search: newSearch });
        }
      } else {
        navigate(`/posts/?tag=${query}`);
      }
    }
  };

  const handleLogout = () => {
    setToken(false);
    localStorage.removeItem("token");
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
                <a className="nav-link" href="/write">
                  Write
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
              {token ? (
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
