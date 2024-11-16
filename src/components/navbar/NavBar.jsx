import "./navBar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import search_icon from "../../assets/search.png";
import avatar_icon from "../../assets/avatar.png";

const NavBar = () => {
  const navigate = useNavigate();

  const [access, setAccess] = useState(true);

  return (
    <div>
      <div className="navbar">
        <Link className="logo" to='/'>
          <h2> The VUB Hub </h2>
        </Link>

        <div>
          <ul className="nav-links">
            <NavLink className="nav-link" to="/">
              <li> Home </li>
            </NavLink>
            <NavLink className="nav-link">
              <li> Write </li>
            </NavLink>
          </ul>
        </div>

        <div className="search-container">
          <input type="text" placeholder="Search for blogs" />
          <img className="search_icon" src={search_icon} alt="Search icon" />
        </div>

        <div className="nav-buttons">
          {access ? (
            <div className="profile-menu">
              <img
                src={avatar_icon}
                alt="User profile avatar"
                className="avatar"
              />
              <div className="dropdown">
                <div className="profile-list">
                  <p onClick={() => navigate("my-profile")}> Profile </p>
                  <p onClick={() => navigate("my-blogs")}> My Blogs </p>
                  <p onClick={() => navigate("my-favourites")}> My Favourites </p>
                  <p onClick={() => setAccess(false)}> Logout </p>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate("/login")}> Sign Up </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
