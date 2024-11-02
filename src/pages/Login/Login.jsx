import { useState } from "react";
import "./Login.css";

const Login = () => {
  const [status, setStatus] = useState("Sign Up");

  return (
    <div className="form-container">
      <form className="form-group">
        <div>
          <h2> {status === "Sign Up" ? "Create account" : "Welcome back"} </h2>
          <p>
            {" "}
            You can{" "}
            {status === "Sign Up"
              ? "create an account here"
              : "sign in to your page"}{" "}
          </p>
        </div>

        <div>
          {status === "Sign Up" && (
            <>
              <p> Name: </p>
              <input type="text" required />
            </>
          )}
          <p> Email address: </p>
          <input type="email" required />
          <p> Password: </p>
          <input type="password" required />
        </div>

        <button className="submit">
          {" "}
          {status === "Sign Up" ? "Create account" : "Login"}{" "}
        </button>

        <div>
          {status === "Sign Up" ? (
            <p>
              {" "}
              Already have an account{" "}
              <span className="form-guide" onClick={() => setStatus("Login")}>
                {" "}
                Sign in{" "}
              </span>{" "}
            </p>
          ) : (
            <p>
              {" "}
              New User?{" "}
              <span className="form-guide" onClick={() => setStatus("Sign Up")}>
                {" "}
                Create an account{" "}
              </span>{" "}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
