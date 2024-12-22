import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "./threadDetails.css";
import { AppContext } from "../../context/AppContext";
import "react-toastify/ReactToastify.css";
import { Bounce, ToastContainer, toast } from "react-toastify";
axios.defaults.withCredentials = true;

const API_URL = "http://localhost:8000"; // Backend URL

// Thread detail page component
const ThreadDetailPage = () => {
  const { threadId } = useParams(); // Extract thread ID from URL which used to fetch thread from backend
  const { userData } = useContext(AppContext); // Logged-in user data
  const navigate = useNavigate(); // Used for navigating between pages
  // Thread state variables
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]); // Stores the list of existing posts
  // Form state variables
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Post state for when creating a new post
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newTag, setNewTag] = useState("");

  // Opens the form for creating a new thread
  const openForm = () => setIsFormOpen(true);

  // Closes the form after creating a new thread
  const closeForm = () => {
    setIsFormOpen(false);
  };

  // Fetch thread and its posts
  useEffect(() => {
    const fetchThreadDetails = async () => {
      try {
        const threadResponse = await axios.get(
          API_URL + `/threads/${threadId}`
        );
        const postsResponse = await axios.get(
          API_URL + `/posts/thread/${threadId}`
        );
        setThread(threadResponse.data); // Update thread state
        setPosts(postsResponse.data); // Update posts state
      } catch (error) {
        // Error handling is more minimal because fetching data is passive and user feedback isn't really necessary
        console.error("Error fetching thread details:", error);
      }
    };

    fetchThreadDetails();
  }, [threadId]); // Runs only when thread id changes

  // Posting a post
  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      // User has to be logged in to create a post
      if (!userData) {
        toast.error("You must be logged in to create a thread.");
        return;
      }

      // validate title
      if (!newPostTitle || newPostTitle.trim() === "") {
        toast.error("Title is required and can't be empty.");
      } else if (newPostTitle.length < 5 || newPostTitle.length > 50) {
        toast.error("Title must be between 5 and 50 characters.");
      }

      // validate content
      if (!newPostContent || newPostContent.trim() === "") {
        toast.error("Content is required and can't be empty.");
      } else if (newPostContent.length < 5 || newPostContent.length > 500) {
        toast.error("Content must be between 5 and 500 characters.");
      }

      // validate tags
      if (newTag && typeof newTag !== "string") {
        errors.push("Tags must be a valid adress string.");
      }

      // validate image URL
      const isValidURL = (url) => {
        try {
          new URL(url); // Will throw an error if the URL is invalid
          return true;
        } catch {
          return false;
        }
      };
      if (newImage && !isValidURL(newImage)) {
        toast.error("Image must be a valid URL.");
      }

      // validate threadId
      if (!threadId || isNaN(threadId)) {
        toast.error("ThreadId is required and must be an integer.");
      }

      // Send the newly created post to the backend with the necessary information
      const response = await axios.post(API_URL + "/posts/", {
        title: newPostTitle,
        content: newPostContent,
        image: newImage,
        tags: newTag,
        threadId: threadId,
      });

      // Status of 201 indicates succession
      if (response.status === 201) {
        // Destructuring the response into variables
        const { postId, title, content, image, tags, authorId, threadId } =
          response.data;
        // Updating the post list with the newly created post
        setPosts([
          ...posts,
          {
            id: postId,
            title,
            content,
            image,
            tags,
            authorId,
            threadId,
            author_name: userData.name,
            author_image: userData.image_profile_url,
          },
        ]);
        closeForm(); // Close form after creating thread
      }
    } catch (error) {
      // Error where request reached but server responded with a fail
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "Something went wrong.");
      } else {
        // Error where request didn't reach server
        console.error("Error when creating thread:", error);
        toast.error("Something went wrong with connecting to the server.");
      }
    }
  };

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
                  <img
                    className="author-profile-pic"
                    src={post.author_image}
                    alt={`${post.author_name}'s profile`}
                  />
                  <span
                    onClick={() => navigate(`/profile/${post.user_id}`)}
                    className="text-secondary fw-bold"
                  >
                    {post.author_name}
                  </span>
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-content">
                    {post.content.length > 100
                      ? `${post.body.substring(0, 100)}...`
                      : post.content}
                  </p>
                  <Link to={`/blogs/${post.id}`} className="read-more">
                    View post
                  </Link>
                  <span className="post-date">
                    Posted on: {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {/* Form for creating a new post */}
      {isFormOpen && (
        <div className="form-post">
          <div className="form-post-content">
            <h2>New Post</h2>
            <form onSubmit={handleCreatePost}>
              <input
                type="text"
                placeholder="Post title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Post content"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <input
                type="text"
                placeholder="image URL"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
              />
              <div className="form-post-actions">
                <button type="submit">Create</button>
                <button type="button" onClick={closeForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default ThreadDetailPage;
