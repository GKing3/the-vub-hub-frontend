import axios from 'axios';
import './Blogs.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { url } from '../../Api';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  // const location = useLocation();
  // const [filterBlogs, setFilterBlogs] = useState([])

  const fetchBlogs = async (tag) => {
    try {
      const link = tag ? url + `posts/?tag=${tag}` : url + 'posts/'
      const response = await axios.get(link);
      console.log(response);
      setBlogs(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, [])

  return (
    <div>
      <h2 className='page-title'> Blogs: Technology </h2>
      <div className='blogs-container'>
        <div>
          {
            blogs.length === 0 ? (
              <p> No blogs found for this tag. </p>
            ) : (
              blogs.slice(0, 10).map((blog) => (
                <div key={blog.id} className='blog-wrapper'>
                  <div> <img src={blog.image_url}/> </div>
                  <div>
                    <h2> {blog.title} </h2>
                    <div className='blog-details'>
                      <p> Written by: {blog.username} </p>
                      <p> {blog.tags} </p>
                    </div>
                    <p> {blog.content} </p>
                  </div>
                </div>
              ))
            )
          }
        </div>
        <div>
          <div className='tags'>
            <Link to='/posts/'> All </Link>
            <Link to='/posts/?tag=technology'> Technology </Link>
            <Link to='/posts/?tag=food'> Food </Link>
            <Link to='/posts/?tag=travel'> Travel </Link>
            <Link to='/posts/?tag=cars'> Cars </Link>
            <Link to='/posts/?tag=football'> Football </Link>
            <Link to='/posts/?tag=fashion'> Fashion </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blogs