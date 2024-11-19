import axios from 'axios';
import './Blogs.css';
import { useState } from 'react';
import { useEffect } from 'react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  const handleBlogs = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      console.log(response);
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
      <p className='page-title'> Browse through different blogs </p>
      <div className='blogs-container'>
        <div>
          {
            blogs.slice(0, 10).map((blog, index) => (
              <div key={index}>
                <h2> {blog.title} </h2>
              </div>
            ))
          }
        </div>
        <div>
          <div className='tags'>
            <p> Technology </p>
            <p> Nutrition </p>
            <p> Vacation </p>
            <p> Fashion </p>
            <p> Football </p>
            <p> Cuisine </p>
            <p> Cars </p>
            <p> Social media </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blogs