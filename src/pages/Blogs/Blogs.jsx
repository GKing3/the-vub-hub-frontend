import axios from "axios";
import "./Blogs.css";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { url } from "../../Api";
import { Link, useLocation, useParams } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";
import { AppContext } from "../../context/AppContext";

const Blogs = () => {
  const { tag } = useParams();
  console.log("test", tag);
  const [blogs, setBlogs] = useState([]);
  const location = useLocation();
  const { userData } = useContext(AppContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(2);
  // const location = useLocation();

  const fetchBlogs = async (tag) => {
    try {
      const link = tag ? url + `posts/tag/${tag}` : url + "posts/";
      console.log("Fetching link:", link);
      const response = await axios.get(link);
      console.log("API Response:", response);

      setBlogs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const lastBlogIndex = currentPage * blogsPerPage;
  const firstBlogIndex = lastBlogIndex - blogsPerPage;
  const currentBlogs = blogs.slice(firstBlogIndex, lastBlogIndex);

  useEffect(() => {
    fetchBlogs(tag);
  }, [tag, userData]);

  return (
    <div>
      <h2 className="page-title"> Blogs: {tag || "All"} </h2>
      <div className="blogs-container">
        <div>
          {blogs.length === 0 ? (
            <p> No blogs found for this tag. </p>
          ) : (
            currentBlogs.map((blog) => (
              <div key={blog.id} className="blog-wrapper">
                <div>
                  {" "}
                  <img src={blog.image_url} />{" "}
                </div>
                <div>
                  <h2> {blog.title} </h2>
                  <div className="blog-details">
                    <div className="author-details">
                      <div>
                        <img src={blog.profile_img} />
                      </div>
                      <p>
                        {" "}
                        <a href="">{blog.username}</a>{" "}
                      </p>
                    </div>
                    <p> {blog.tags} </p>
                  </div>
                  <p> {blog.content} </p>
                </div>
              </div>
            ))
          )}
          <Pagination
            totalBlogs={blogs.length}
            blogsPerPage={blogsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
        <div>
          <div className="tags">
            <Link to="/posts/"> All </Link>
            <Link to="/posts/technology"> Technology </Link>
            <Link to="/posts/food"> Food </Link>
            <Link to="/posts/travel"> Travel </Link>
            <Link to="/posts/cars"> Cars </Link>
            <Link to="/posts/football"> Football </Link>
            <Link to="/posts/fashion"> Fashion </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
