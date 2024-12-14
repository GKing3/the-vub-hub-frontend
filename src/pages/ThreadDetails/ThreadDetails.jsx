import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "./threadDetails.css";
import { AppContext } from "../../context/AppContext";
axios.defaults.withCredentials = true;

const API_URL = "http://localhost:8000"; // Backend URL

const ThreadDetailPage = () => {
  const { threadId } = useParams(); // Extract thread ID from URL
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useContext(AppContext);

  // Opens the form for creating a new thread
  const openForm = () => setIsFormOpen(true);

  // Closes the form after creating a new thread
  const closeForm = () => {
    setIsFormOpen(false);
    //setNewThreadTitle(""); // resetting form
  };

  useEffect(() => {
    const fetchThreadDetails = async () => {
      try {
        const threadResponse = await axios.get(
          API_URL + `/threads/${threadId}`
        );
        const postsResponse = await axios.get(
          API_URL + `/posts/thread/${threadId}`
        );
        setThread(threadResponse.data);
        console.log(threadResponse.data);
        setPosts(postsResponse.data);
        console.log(postsResponse.data);
      } catch (error) {
        console.error("Error fetching thread details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreadDetails();
  }, [threadId]);

  // Posting a post
  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to create a thread.");
        return;
      }

      const payloadBase64 = token.split(".")[1]; // Get the payload part of the JWT
      const payload = JSON.parse(atob(payloadBase64)); // Decode the Base64 payload
      const userId = payload.id; // Extract the user ID (or any other data)
      console.log("User ID:", userId);

      const response = await axios.post(
        API_URL + "/posts/",
        {
          title: newPostTitle,
          content: newPostContent,
          image: null,
          tags: null,
          reading_time: null,
          threadId: threadId,
        }
        //{ headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        const { postId, title, content, idThread, authorId } = response.data;
        setPosts([
          ...posts,
          { id: postId, title, content, idThread, authorId },
        ]);
        closeForm(); // close form after creating thread
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.error || "Er ging iets mis");
      } else {
        console.error("Fout bij het maken van de thread:", error);
        alert("Er ging iets mis bij het verbinden met de server.");
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="thread-detail-page">
      {thread && (
        <>
          <header>
            {/* thread object is given in an array */}
            <h1>{thread[0].title}</h1>
            <button className="create-post-button" onClick={openForm}>
              Create post
            </button>
          </header>
          <div>
            <h2>Posts in this Thread</h2>
            <ul className="posts-list">
              {posts.map((post) => (
                <li key={post.id} className="post-item">
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-content">
                    {post.content.length > 100
                      ? `${post.body.substring(0, 100)}...`
                      : post.content}
                  </p>
                  <Link to={`/blogs/${post.id}`} className="read-more">
                    View post
                  </Link>
                  <span className="post-date">{post.created_at}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {/* Form for creating a new thread */}
      {isFormOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>New Post</h2>
            <form onSubmit={handleCreatePost}>
              <input
                type="text"
                placeholder="Post title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Post content"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                required
              />
              <div className="modal-actions">
                <button type="submit">Create</button>
                <button type="button" onClick={closeForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadDetailPage;
