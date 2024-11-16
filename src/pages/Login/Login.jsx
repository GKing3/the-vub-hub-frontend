import "./Login.css";
import { useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import 'react-toastify/ReactToastify.css';

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const Login = () => {
  const [status, setStatus] = useState("Sign Up");

  const [state, setState] = useState(initialState);

  const handleChange = (e) => {
    setState({...state, [e.target.name]: e.target.value});
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/register', initialState);
    const data = await response.json();
    console.log(data);

    if(!state.email || !state.password) {
      toast.error('Please fill out all fields');
    } else if(status === 'Sign Up') {
        if(!state.name || !state.email || !state.password || !state.confirmPassword) {
          toast.error('Please fill out all fields');
        } else if(state.password !== state.confirmPassword) {
          toast.error('Passwords do not match!');
        } else {
          toast.success('Account created successfully');
        }
    } else {
      toast.success('Logged in successfully!');
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-group" method="post">
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

        <div className="form-input">
          {status === "Sign Up" && (
            <>
              <p> Name: </p>
              <input type="text" name="name" onChange={handleChange} value={state.name} />
            </>
          )}
          <p> Email address: </p>
          <input type="email" name="email" onChange={handleChange} value={state.email} />
          <p> Password: </p>
          <input type="password" name="password" onChange={handleChange} value={state.password} />
          {
            status === 'Sign Up' && (
              <>
                <p> Confirm Password: </p>
                <input type="password" name="confirmPassword" onChange={handleChange} value={state.confirmPassword} />
              </>
            )
          }
        </div>

        <button className="submit" type="submit">
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

export default Login;
