import "./Home.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../Api";
import { useEffect, useState } from "react";
import { ChatLeftDots, Heart } from "react-bootstrap-icons";

const Home = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [likes, setLikes] = useState();

  const formatDate = (isodate) => {
    const date = new Date(isodate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const handleBlogs = async() => {
    try {
      const response = await axios.get(url + 'posts/');
      // console.log(response);
      setBlogs(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleBlogs();
  }, [])

  return (
    <div>
      <article className="featured-container">
        <div className="featured-details">
          {
            blogs.slice(0, 1).map((blog) => (
              <div key={blog.id}>
                <Link className="featured-tag" onClick={() => navigate(`/posts/${blogs.tags}`)}> {blog.tags} </Link>
                <h2 className="featured-title" onClick={() => navigate(`/posts/${blog.id}`)}> {blog.title} </h2>
                <p> {formatDate(blog.created_at)} </p>
              </div>
            ))
          }
        </div>
        <div className="featured-post">
          {
            blogs.slice(0, 1).map((blog) => (
              <>
                <img src={blog.image_url} alt="Featured Post" />
              </>
            ))
          }
        </div>
      </article>
      <div className="popular-container">
        <h2> Popular Posts </h2>
        <div className="popular-posts">
          {
            blogs.map((blog) => (
              <>
                <div key={blog.id}>
                  <img src={blog.image_url} alt="Popular Post" />
                  <div className="main-details">
                    <Link onClick={() => navigate(`/posts/${blogs.tags}`)}> {blog.tags} </Link>
                    <span> {formatDate(blog.created_at)} </span>
                  </div>
                  <Link className="main-title" to={`/posts/${blog.id}`}> {blog.title} </Link>
                </div>
              </>
            ))
          }
        </div>
      </div>
      <div className="latest-container">
        <h2> Latest Posts </h2>
        <div className="latest-posts">
          {
              blogs.map((blog) => (
                <>
                  <div key={blog.id}>
                    <img src={blog.image_url} alt="Latest Posts" />
                    <div className="main-details">
                      <Link onClick={() => navigate(`/posts/${blogs.tags}`)}> {blog.tags} </Link>
                      <span> {formatDate(blog.created_at)} </span>
                    </div>
                    <Link className="main-title" to={`/posts/${blog.id}`}> {blog.title} </Link>
                  </div>
                </>
              ))
            }
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
        <button onClick={() => {navigate('/posts/'); scrollTo(0, 0)}} className="hero-button"> Explore Now </button>
      </div>
    </div>
  );
};

export default Home;
