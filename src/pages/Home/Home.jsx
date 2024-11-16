import "./Home.css";
import post001 from '../../assets/post-001.jpg';
import Api from '../../Api.js';

const Home = () => {
  let myBlogs = Api.getBlogs();
  console.log(myBlogs);

  return (
    <div>
      <div className="featured-container">
        <div className="featured-details">
          {
            myBlogs.map((blog, index) => (
              <div key={index}>
                <p> {blog.category} </p>
                <h2> {blog.title} </h2>
              </div>
            ))
          }
        </div>
        <div className="featured-post">
          <img src={post001} alt="A child wearing a VR headset" />
        </div>
      </div>
      <div className="latest-container">
        <h2> Latest Posts </h2>
        <div className="latest-posts">
          <div> Box 1 </div>
          <div> Box 2 </div>
          <div> Box 3 </div>
          <div> Box 4 </div>
          <div> Box 5 </div>
          <div> Box 6 </div>
          <div> Box 7 </div>
          <div> Box 8 </div>
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
        <button className="hero-button"> Explore Now </button>
      </div>
    </div>
  );
};

export default Home;
