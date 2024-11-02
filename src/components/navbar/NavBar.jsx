import { NavLink, useNavigate } from "react-router-dom";
import "./navBar.css";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="navbar">
        <h2 onClick={() => navigate("/")}> The VUB Hub </h2>

        <div>
          <ul className="nav-links">
            <NavLink className="nav-link" to="/">
              <li> Home </li>
            </NavLink>
            <NavLink className="nav-link">
              <li> Write </li>
            </NavLink>
            <NavLink className="nav-link">
              <li> About Us </li>
            </NavLink>
            <NavLink className="nav-link">
              <li> Support </li>
            </NavLink>
          </ul>
        </div>

        <div className="nav-buttons">
          <button onClick={() => navigate("/login")}> Sign Up </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
