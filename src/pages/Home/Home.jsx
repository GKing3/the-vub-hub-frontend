import "./Home.css";
import search_icon from "../../assets/search.png";

const Home = () => {
  return (
    <div>
      <div className="search-container">
        <input type="text" placeholder="Search for blogs" />
        <img className="search_icon" src={search_icon} alt="Search icon" />
      </div>
      <div className="hero-section">
        <div className="hero-description">
          <h2> Discover, Share and Connect </h2>
          <p>
            {" "}
            Join a community of VUB students that value your input and are
            passionate about sharing knowledge, experiences and campus updates.{" "}
            <br />
            Start exploring or add your voice to the conversation.{" "}
          </p>
        </div>
        <button className="hero-button"> Explore Now </button>
      </div>
    </div>
  );
};

export default Home;
