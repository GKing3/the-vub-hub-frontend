import "./App.css";
import React from "react";
import { AppContextProvider } from "./context/AppContext";
import NavBar from "./components/navbar/NavBar";
import Footer from "./components/footer/Footer";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import MyProfile from "./pages/MyProfile/MyProfile";
import MyBlogs from "./pages/MyBlogs/MyBlogs";
import MyFavourites from "./pages/MyFavourites/MyFavourites";
import Blogs from "./pages/Blogs/Blogs";
import BlogDetails from "./pages/BlogDetails/BlogDetails";
import WritePage from "./pages/write/WritePage";

function App() {
  return (
    <React.Fragment>
      <AppContextProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-blogs" element={<MyBlogs />}></Route>
          <Route path="/blog-details/:postId" element={<BlogDetails />} />
          <Route path="/my-favourites" element={<MyFavourites />}></Route>
          <Route path="/blogs" element={<Blogs />}></Route>
        </Routes>
        <Footer />
      </AppContextProvider>
    </React.Fragment>
  );
}

export default App;
