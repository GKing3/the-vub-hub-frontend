import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "react-toastify/ReactToastify.css";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "./blogDetails.css";

/*
The names blog and post are uses interchangeable 
*/

const API_URL = "http://localhost:8000"; // Backend URL

const BlogDetails = () => {
  const { blogId } = useParams(); // Extracting postId from URL
  const { userData } = useContext(AppContext); // Logged-in user data
  const navigate = useNavigate(); // Used for navigating between pages

  // Post state initialization
  const [post, setPost] = useState([]); // Holds the displayed post and its information
  const [likes, setLikes] = useState(0); // Holds likes count wich is synchronized with the backend
  const [dislikes, setDislikes] = useState(0); // Holds dislikes count wich is synchronized with the backend
  // Comment section
  const [comments, setComments] = useState([]); // Holds the comments
  const [newComment, setNewComment] = useState(""); // Holds a new comment
  // State for editing a post
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newTag, setNewTag] = useState("");
  const [editingPost, setEditingPost] = useState(false); // Show edit form when true
  const [editFlag, setEditFlag] = useState(false); // Flag to check if post has been edited

  // Fetching post details (post, comments, likes/dislikes)
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // fetch post and store it
        const postResponse = await axios.get(
          `${API_URL}/posts/postId/${blogId}`
        );
        setPost(postResponse.data);

        // fetch comments of that post and store them
        const commentsResponse = await axios.get(
          `${API_URL}/comments/${blogId}`
        );
        setComments(commentsResponse.data);

        // fetch likes/dislikes of post and store their count
        const postReactionsResponse = await axios.get(
          API_URL + `/react/count/${blogId}`
        );
        setLikes(postReactionsResponse.data.likes);
        setDislikes(postReactionsResponse.data.dislikes);
      } catch (err) {
        console.error("Error fetching post details:", err);
      }
    };

    fetchPostDetails();
  }, [blogId, editFlag]); // Runs when blogId changes or when post has been edited. (also when a comment has been liked/disliked)

  // handling of likes and dislikes for a post
  const handlePostReaction = async (reactionType) => {
    try {
      // Check if the user has already reacted
      const reactionResponse = await axios.get(
        `${API_URL}/react/reaction/${blogId}`
      );
      // Check if user has already reacted with same reactionType
      if (reactionResponse.data.reaction === reactionType) {
        // User has already reacted with the same reactionType so remove it
        await axios.delete(`${API_URL}/react/${blogId}`);
        // Decrement appropriate reaction count locally
        if (reactionType === "like") {
          setLikes((prev) => prev - 1);
        } else {
          setDislikes((prev) => prev - 1);
        }
        // If not already reacted with same reactionType, see if it exists
      } else if (reactionResponse.data.reaction) {
        // User has an existsing reaction which is not the same thus we need to remove old reaction and add new one
        if (reactionType === "like") {
          await axios.post(`${API_URL}/react/like/${blogId}`); // add like
          setLikes((prev) => prev + 1); // Increment likes count locally
          setDislikes((prev) => prev - 1); // Decrement dislikes count locally
        } else {
          await axios.post(`${API_URL}/react/dislike/${blogId}`); // add dislike
          setDislikes((prev) => prev + 1); // Increment dislikes count locally
          setLikes((prev) => prev - 1); // Decrement likes count locally
        }
      }
    } catch (err) {
      // When there is no existing reaction of the user
      if (err.status == 404) {
        console.log("No reaction found, proceeding with adding reaction.");
        // Add like in case user has liked
        if (reactionType === "like") {
          await axios.post(`${API_URL}/react/like/${blogId}`);
          setLikes((prev) => prev + 1); // Increment likes locally
        } else {
          // Add dislike in case user has disliked
          await axios.post(`${API_URL}/react/dislike/${blogId}`);
          setDislikes((prev) => prev + 1); // Increment likes locally
        }
      }
      console.error("Error reacting:", err);
    }
  };

  // Editing a post
  const handleEditPost = async () => {
    e.preventDefault();
    try {
      // validate title
      if (!newTitle || newTitle.trim() === "") {
        toast.error("Title is required and can't be empty.");
      } else if (newPostTitle.length < 5 || newPostTitle.length > 50) {
        toast.error("Title must be between 5 and 50 characters.");
      }

      // validate content
      if (!newContent || newContent.trim() === "") {
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
      // Update an existing post row in the database with new values
      const response = await axios.put(`${API_URL}/posts/${blogId}`, {
        title: newTitle,
        content: newContent,
        image_url: newImage,
        tags: newTag,
      });
      if (response.status === 200) {
        // When it is succesfull, close form and change editFlag to refresh post so that useEffect runs and fetches new edited post
        setEditingPost(null);
        if (editFlag) {
          setEditFlag(false);
        } else setEditFlag(true);
      }
    } catch (err) {
      console.error("Error editing post:", err);
    }
  };

  // Deleting a post
  const handleDeletePost = async () => {
    try {
      const response = await axios.delete(`${API_URL}/posts/${blogId}`);
      // When succesfull, return to thread page
      if (response.status === 200) {
        navigate("/Threads");
      }
    } catch (err) {
      console.error("Error removing post:", err);
      alert("Failed to remove post. Please try again.");
    }
  };

  // Adding a new comment
  const handleAddComment = async () => {
    // validation comment input
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty.");
    } else if (newComment.length < 3 || newComment.length > 500) {
      toast.error("Comment has to be between 5 and 500 characters");
    }

    try {
      // send data to backend
      const response = await axios.post(`${API_URL}/comments/post/${blogId}`, {
        content: newComment,
      });
      // update comment section and resetting input field for next comment
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment. Please try again.");
    }
  };

  // Removing a comment
  const handleRemoveComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/comments/${blogId}/${commentId}`
      );
      // When succesfull remove comment out of comment list
      if (response.status === 200) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.commentId !== commentId)
        );
      }
    } catch (err) {
      console.error("Error removing comment:", err);
      toast.error("Failed to remove comment. Please try again.");
    }
  };

  // Handling likes and dislikes for a comment
  const handleReact = async (commentId, reactionType) => {
    if (!commentId) {
      console.error("Comment ID is undefined.");
      return;
    }

    try {
      // Fetching current comment reaction of user if it exists
      const reactionResponse = await axios.get(
        `${API_URL}/react/comments/reaction/${commentId}`
      );

      // If already reacted with the same type, remove the reaction and decrement locally
      if (reactionResponse.data.reaction === reactionType) {
        await axios.delete(`${API_URL}/react/comments/reaction/${commentId}`);
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likes:
                    reactionType === "like" ? comment.likes - 1 : comment.likes,
                  dislikes:
                    reactionType === "dislike"
                      ? comment.dislikes - 1
                      : comment.dislikes,
                }
              : comment
          )
        );
      } else {
        // comment reaction is not of same type so toggle the reaction type
        await axios.post(`${API_URL}/react/comments/react/${commentId}`, {
          reaction: reactionType,
        });
        // locally increment one and decrement the other based on reactionType
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likes:
                    reactionType === "like"
                      ? comment.likes + 1
                      : comment.likes - 1,
                  dislikes:
                    reactionType === "dislike"
                      ? comment.dislikes + 1
                      : comment.dislikes - 1,
                }
              : comment
          )
        );
      }
    } catch (err) {
      // When there is no existing comment reaction found so just post it and increment reactionType locally
      if (err.response?.status == 404) {
        console.log("No reaction found, proceeding with adding like.");
        await axios.post(`${API_URL}/react/comments/react/${commentId}`, {
          reaction: reactionType,
        });
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likes:
                    reactionType === "like" ? comment.likes + 1 : comment.likes,
                  dislikes:
                    reactionType === "dislike"
                      ? comment.dislikes + 1
                      : comment.dislikes,
                }
              : comment
          )
        );
      } else {
        console.error("Error toggling like:", err);
      }
    }
  };

  // Share functionality
  const postUrl = `${window.location.origin}/blogs/${blogId}`;
  const postTitle = encodeURIComponent(post.title);

  return (
    <div className="post-detail-container">
      {post && (
        <div className="post-detail">
          {/* post header */}
          <div className="post-header">
            <div className="post-author">
              <img
                className="author-profile-pic"
                src={post.author_image}
                alt={`${post.author_name}'s profile`}
              />
              <span className="author-name">{post.author_name}</span>
            </div>
          </div>

          {editingPost && (
            <div className="edit-post-form">
              <form onSubmit={handleEditPost}>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Edit title"
                />
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Edit content"
                ></textarea>
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
                <button type="submit">Save Changes</button>
                <button onClick={() => setEditingPost(false)}>Cancel</button>
              </form>
            </div>
          )}

          {/* Post Body */}
          <div className="post-body">
            {/* Post Content and Image */}
            <div>
              {/* Post Title */}
              <h1 className="post-title">{post.title}</h1>
              {/* post tag */}
              <span
                className="badge"
                style={{ backgroundColor: "#34495e", color: "white" }}
              >
                {post.tags}
              </span>
              {/* Post Content */}
              <p className="post-content">{post.content}</p>
            </div>
            {post.image_url && (
              <div className="image-section">
                <img
                  className="post-image"
                  src={post.image_url}
                  alt="Post image"
                />
              </div>
            )}
          </div>

          {/* Post footer */}
          <div className="post-footer">
            <span className="post-date">
              Posted on: {new Date(post.created_at).toLocaleDateString()}
            </span>
            <div className="post-reactions">
              <button
                className="like-button"
                onClick={() => handlePostReaction("like")}
              >
                👍 {likes}
              </button>
              <button
                className="dislike-button"
                onClick={() => handlePostReaction("dislike")}
              >
                👎 {dislikes}
              </button>
            </div>
            <div className="social-share-buttons">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${postTitle}&url=${postUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon twitter"
              >
                <FaTwitter />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${postTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon linkedin"
              >
                <FaLinkedinIn />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${postTitle}%20${postUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon whatsapp"
              >
                <FaWhatsapp />
              </a>
              <a
                href={`mailto:?subject=${postTitle}&body=Check%20this%20out:%20${postUrl}`}
                className="social-icon email"
              >
                <MdEmail />
              </a>
            </div>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h2>Comments</h2>
            {comments.length > 0 ? (
              <ul className="comments-list">
                {comments.map((comment, idx) => (
                  <li key={idx} className="comment-item">
                    <img
                      className="author-profile-pic-comment"
                      src={comment.user_image}
                      alt={`${comment.user_name}'s profile`}
                    />
                    <span className="author-name">{comment.user_name}</span>
                    <p className="comment-content">{comment.content}</p>
                    {comment.user_id === userData.id && (
                      <button
                        className="delete-comment-button"
                        onClick={() => handleRemoveComment(comment.id)}
                      >
                        Delete
                      </button>
                    )}
                    <div className="comment-reactions">
                      <button
                        className="like-button"
                        onClick={() => handleReact(comment.id, "like")}
                      >
                        👍 {comment.likes}
                      </button>
                      <button
                        className="dislike-button"
                        onClick={() => handleReact(comment.id, "dislike")}
                      >
                        👎 {comment.dislikes}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}

            {/* Add New Comment */}
            <div className="add-comment">
              <textarea
                className="comment-input"
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
              ></textarea>
              <button className="add-comment-button" onClick={handleAddComment}>
                Add Comment
              </button>
              {/* edit and delete button */}
              {post.authorId === userData.id && (
                <div>
                  <button
                    className="edit-post-button"
                    onClick={() => setEditingPost(true)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-post-button"
                    onClick={handleDeletePost}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
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

export default BlogDetails;
