import "./navBar.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import search_icon from "../../assets/search.png";
import avatar_icon from "../../assets/avatar.png";
import { AppContext } from "../../context/AppContext";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
;
  const {userData, access, setAccess} = useContext(AppContext);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    if(e.key === 'Enter') {
      const query = e.target.value;

      if(location.pathname === '/posts/') {
        const newSearch = `?tag=${query}`;
        if(location.search !== newSearch) {
          navigate({ pathname: location.pathname, search: newSearch });
        }
      } else {
        navigate(`/posts/?tag=${query}`);
      }
    }
  }

  const handleLogout = () => {
    setAccess(false);
    localStorage.removeItem('access');
  }

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
          <input type="text" placeholder="Search for blogs" onKeyDown={handleSearch}/>
          <img className="search_icon" src={search_icon} alt="Search icon" />
        </div>

        <div className="nav-buttons">
          {access ? (
            <div className="profile-menu">
              <img
                src={userData.image || avatar_icon}
                alt="User profile avatar"
                className="avatar"
              />
              <div className="dropdown">
                <div className="profile-list">
                  <p onClick={() => navigate("my-profile")}> Profile </p>
                  <p onClick={() => navigate("my-blogs")}> My Blogs </p>
                  <p onClick={() => navigate("my-favourites")}> My Favourites </p>
                  <p onClick={handleLogout}> Logout </p>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate("/register")}> Sign Up </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
