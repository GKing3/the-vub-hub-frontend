import "./Home.css";
import post001 from '../../assets/post-001.jpg';
import Api from '../../Api.js';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const navigate = useNavigate();

  let myBlogs = Api.getBlogs();
  console.log(myBlogs);

  // const [users, setUsers] = useState([]);

  // const handleUsers = () => {
  //   Api.getUsers().then((data) => {
  //     console.log(data);
  //     setUsers(data);
  //   })
  // }

  // useEffect(() => {
  //   handleUsers()
  // }, [])

  return (
    <div>
      <article className="featured-container">
        <div className="featured-details">
          {
            myBlogs.map((blog, index) => (
              <div key={index}>
                <Link className="featured-tag" hrefLang={`/tags/${blog.tags}`}> {blog.tags[0]} </Link>
                <h2> {blog.title} </h2>
                <p> {blog.created_at} </p>
              </div>
            ))
          }
        </div>
        <div className="featured-post">
          <img src={post001} alt="A child wearing a VR headset" />
        </div>
      </article>
      <div className="latest-container">
        <h2> Latest Posts </h2>
        <div className="latest-posts">
          <div>box 1</div>
          <div>box 2</div>
          <div>box 3</div>
          <div>box 4</div>
          <div>box 5</div>
          <div>box 6</div>
        </div>
      </div>
      <div className="hero-section">
        <div className="hero-description">
          <h2> Discover, Share and Connect </h2>
          <p> Join a community of VUB students that value your input and are
            passionate about sharing knowledge, experiences and campus updates.
            <br />
            Start exploring or add your voice to the conversation.
          </p>
        </div>
        <button onClick={() => navigate('/blogs')} className="hero-button"> Explore Now </button>
      </div>
    </div>
  );
};

export default Home;
