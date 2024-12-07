import { useState } from "react";
import "./writePage.css";

// JSONPlaceholder as mock backend for the moment
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const WritePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [media, setMedia] = useState(null);

  const handleSubmit = async () => {
    if (title.trim() === "" || content.trim() === "") {
      alert("Please fill out both the title and content!");
      return;
    }

    // Prepare data for submission by creating an object representing the new post
    // This is for the moment tailered to the JSONPlaceholder which expects these fields
    const newPost = {
      title,
      body: content,
      userId: 1,
      link: link.trim() !== "" ? link : null, // voeg link toe als deze is ingevoerd
      media: media ? URL.createObjectURL(media) : null, // voeg media toe als deze is geüpload
    };

    try {
      // Sending the data
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost), //Contains the data that is send as a serialized JSON string
      });

      // Handle respons
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Succes handling
      const responseData = await response.json();
      console.log("Post submitted successfully:", responseData);
      alert("Post submitted successfully!");
      // Clear form when post is succesfully submitted
      setTitle("");
      setContent("");
      setLink("");
      setMedia(null);
      //Error handling
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit post. Please try again.");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    console.log("Post creation canceled.");
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
    }
  };

  return (
    <div className="write-container">
      <h2 className="header">Create a post</h2>

      {/* Title */}
      <div className="inputContainer">
        <label htmlFor="post-title" className="label">
          Title
        </label>
        <input
          id="post-title"
          type="text"
          placeholder="Enter your post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
      </div>

      {/* Content */}
      <div className="inputContainer">
        <label htmlFor="post-content" className="label">
          Content
        </label>
        <textarea
          id="post-content"
          placeholder="Write your post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea"
        />
      </div>

      {/* Link */}
      <div className="inputContainer">
        <label htmlFor="post-link" className="label">
          Link
        </label>
        <input
          id="post-link"
          type="url"
          placeholder="Enter a URL"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="input"
        />
      </div>

      {/* Media Upload */}
      <div className="inputContainer">
        <label htmlFor="post-media" className="label">
          Upload Media (Image/Video)
        </label>
        <input
          id="post-media"
          type="file"
          accept="image/*,video/*"
          onChange={handleMediaUpload}
          className="input"
        />
        {media && <p>Selected file: {media.name}</p>}
      </div>

      {/* Buttons */}
      <div className="buttonContainer">
        <button onClick={handleSubmit} className="submitButton">
          Post
        </button>
        <button onClick={handleCancel} className="cancelButton">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default WritePage;
