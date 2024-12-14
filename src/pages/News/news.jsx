import "./news.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const NewsTab = () => {
  //useState hooks => Voor het beheren van state.
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  //useEffect: Doet iets automatisch als er iets verandert, zoals nieuwe data ophalen.
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:8000/news");
        setNewsData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("An error occurred while fetching the news.");
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  //haal comments van een artikel
  const fetchComments = async (articleId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/comments/article/${articleId}`
      );
      setComments((prevComments) => ({
        ...prevComments, // copy vorige state
        [articleId]: response.data, //nieuwe key-value-paar toe (id, comments)
      }));
    } catch (err) {
      if (err.response?.status === 404) {
        setComments((prevComments) => ({
          ...prevComments,
          [articleId]: [],
        }));
      } else {
        console.error(`Error fetching comments for article ${articleId}:`, err);
      }
    }
  };

  const handleAddComment = async (articleId) => {
    const content = newComments[articleId];
    if (!content || content.trim() === "") {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/comments/article/${articleId}`,
        {
          user: 1, // verander dit, get de id of de user dat ingelogd is
          content,
        }
      );

      setComments((prevComments) => ({
        //doe die de nieuwe comment in de commenten list
        ...prevComments,
        [articleId]: [
          ...(prevComments[articleId] || []), // nieuw paar of vervang
          { content: response.data.content, user_id: response.data.user_id },
        ],
      }));

      setNewComments((prevNewComments) => ({
        ...prevNewComments,
        [articleId]: "",
      }));
    } catch (err) {
      console.error(`Error adding comment to article ${articleId}:`, err);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div className="container my-4">
      <div className="row">
        {newsData.map((article) => (
          <div key={article.id} className="col-md-4 mb-4">
            <div className="card h-100 custom-card">
              <img
                src={article.urlToImage}
                alt={article.title}
                className="card-img-top"
                style={{ height: "150px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">{article.description}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-link text-primary p-0 mt-auto"
                  style={{ fontSize: "0.6rem" }}
                >
                  Read more
                </a>
              </div>
              <div className="card-footer bg-white">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => fetchComments(article.id)}
                >
                  View comments
                </button>
                {comments[article.id] && comments[article.id].length > 0 && (
                  <ul className="list-unstyled mt-2">
                    {comments[article.id].map((comment, idx) => (
                      <li key={idx} className="border-bottom py-2">
                        <p className="mb-0 fw-bold">
                          {comment.user_name || "Anonymous"}:
                        </p>
                        <p className="mb-0">{comment.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
                <textarea
                  className="form-control form-control-sm mt-2"
                  rows="2"
                  value={newComments[article.id] || ""}
                  onChange={(e) =>
                    setNewComments((prevNewComments) => ({
                      ...prevNewComments,
                      [article.id]: e.target.value,
                    }))
                  }
                  placeholder="Write a comment"
                />
                <button
                  className="btn btn-primary btn-sm mt-2"
                  onClick={() => handleAddComment(article.id)}
                >
                  Add comment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTab;
