import { useState, useEffect } from "react";
import axios from "axios";
import "./thread.css";
import { Link } from "react-router-dom";
import "react-toastify/ReactToastify.css";
import { Bounce, ToastContainer, toast } from "react-toastify";

const API_URL = "http://localhost:8000"; // Backend URL

// ThreadPage Component
const ThreadPage = () => {
  // State variables
  const [isFormOpen, setIsFormOpen] = useState(false); // Controls visibility of the form
  const [newThreadTitle, setNewThreadTitle] = useState(""); // Stores the input value for the new thread title when creating one
  const [threads, setThreads] = useState([]); // Stores the list of threads

  // Opens the form for creating a new thread
  const openForm = () => setIsFormOpen(true);

  // Closes the form after creating a new thread or cancelling the action
  const closeForm = () => {
    setIsFormOpen(false);
    setNewThreadTitle(""); // resetting form input
  };

  // Fetches the list of existing threads from the backend
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await axios.get(API_URL + "/threads/");
        setThreads(response.data); // Update the state with the fetched threads
      } catch (error) {
        // Error handling is more minimal because fetching data is passive and user feedback isn't really necessary
        console.error("Error fetching threads:", error);
        alert("Something went wrong fetching the threads.");
      }
    };

    fetchThreads();
  }, []); // Run only once when the component mounts

  // Handles the creation of a new thread
  const handleCreateThread = async (e) => {
    e.preventDefault();

    // Input validation
    if (!newThreadTitle.trim() === "") {
      toast.error("Thread title can't be empty.");
    } else if (newThreadTitle.length < 5 || newThreadTitle > 50) {
      toast.error("Thread title needs to be between 5 and 50 characters.");
    }

    try {
      // Send the new thread title to the backend
      const response = await axios.post(API_URL + "/threads/", {
        title: newThreadTitle,
      });
      if (response.status === 201) {
        // Destructure the response and update the thread list
        const { threadId, title } = response.data;
        setThreads([...threads, { id: threadId, title }]);
        closeForm(); // Close form after creating thread
      }
    } catch (error) {
      // Error where request reached but server responded with a fail
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "Something went wrong.");
      } else {
        // Error where request didn't reach server
        console.error("Error when creating thread:", error);
        toast.erro("Something went wrong with connecting to the server.");
      }
    }
  };

  return (
    <div className="thread-page">
      <header className="thread-header">
        <h1>Thread Summary</h1>
        <button className="create-thread-button" onClick={openForm}>
          Create thread
        </button>
      </header>

      <main className="thread-list">
        <h2>Existing Threads</h2>
        <ul>
          {threads.map((thread) => {
            return (
              <li key={thread.id} className="thread-item">
                <h3>{thread.title}</h3>
                <Link to={`/threadDetail/${thread.id}`}>
                  <button className="view-thread-button">View Thread</button>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>

      {/* Form for creating a new thread */}
      {isFormOpen && (
        <div className="form-thread">
          <div className="form-thread-content">
            <h2>New Thread</h2>
            <form onSubmit={handleCreateThread}>
              <input
                type="text"
                placeholder="Thread title"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                required
              />
              <div className="form-thread-actions">
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

export default ThreadPage;
