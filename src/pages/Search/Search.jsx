import React from "react";
import { useLocation, useNavigate } from "react-router-dom";


const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { users = [], threads = [], posts = [] } = location.state || {};

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Search Results</h1>

      {/* Users Section */}
      <div className="mb-5">
        <h2>Users</h2>
        {users.length > 0 ? (
          <div className="row">
            {users.map((user, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div className="card">
                  <div className="card-body">
                  <img
                  src={user.image_profile_url}
                  className="rounded-circle me-2"
                  style={{ width: "30px", height: "30px", objectFit: "cover" }}
                />
                    <h5 className="card-title">{user.name}</h5>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/profile/${user.id}`)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No users found.</p>
        )}
      </div>

      {/* Threads Section */}
      <div className="mb-5">
        <h2>Threads</h2>
        {threads.length > 0 ? (
          <div className="row">
            {threads.map((thread, index) => (
              <div className="col-md-6 mb-3" key={index}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{thread.title}</h5>
                    <p className="card-text">{thread.description}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/threadDetail/${thread.id}`)}
                    >
                      View Thread
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No threads found.</p>
        )}
      </div>
      
      {/* Posts Section */}
      <div className="mb-5">
        <h2>Posts</h2>
        {posts.length > 0 ? (
          <div className="row">
            {posts.map((post, index) => (
              <div className="col-md-6 mb-3" key={index}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.content}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/blogs/${post.id}`)}
                    >
                      View Post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
