import "./App.css";
import React from "react";
import NavBar from "./components/navbar/NavBar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import MyProfile from "./pages/MyProfile/MyProfile";
import MyBlogs from "./pages/MyBlogs/MyBlogs";

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-profile" element={<MyProfile/>} />
        <Route path="/my-blogs" element={<MyBlogs/>}></Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;
