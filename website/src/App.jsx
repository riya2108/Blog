import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="video-background">
        <video autoPlay loop muted>
        <source src="https://cdn.pixabay.com/video/2016/11/04/6266-190550868_tiny.mp4" type="video/mp4" />

        </video>
      </div>
      <div className="navbar">
        <h2 className="logo">Journall</h2>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/add">Add Blog</Link>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/add" element={<AddBlog />} />
        <Route path="/edit/:id" element={<EditBlog />} />
      </Routes>
    </Router>
  );
};

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    setBlogs(savedBlogs);
  }, []);

  const handleDelete = (id) => {
    const updatedBlogs = blogs.filter((_, idx) => idx !== id);
    setBlogs(updatedBlogs);
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
  };

  return (
    <div className="container">
      <input
        className="search"
        placeholder="Search blogs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="blog-list">
        {blogs
          .filter((blog) => blog.title.toLowerCase().includes(search.toLowerCase()))
          .map((blog, idx) => (
            <div className="blog-card colorful-border" key={idx}>
              {blog.imageUrl && <img src={blog.imageUrl} alt="" />}
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
              <div className="btn-group">
                <button className="delete" onClick={() => handleDelete(idx)}>Delete</button>
                <Link to={`/edit/${idx}`}><button className="edit">Edit</button></Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const handleAdd = () => {
    const newBlog = { title, content, imageUrl };
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    blogs.push(newBlog);
    localStorage.setItem("blogs", JSON.stringify(blogs));
    navigate("/");
  };

  return (
    <div className="form">
      <h2>Add a New Blog</h2>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <input placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      <button onClick={handleAdd}>Add Blog</button>
    </div>
  );
};

const EditBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const id = window.location.pathname.split("/").pop();

  useEffect(() => {
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const blog = blogs[id];
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setImageUrl(blog.imageUrl);
    }
  }, [id]);

  const handleEdit = () => {
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    blogs[id] = { title, content, imageUrl };
    localStorage.setItem("blogs", JSON.stringify(blogs));
    navigate("/");
  };

  return (
    <div className="form">
      <h2>Edit Blog</h2>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <input placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      <button onClick={handleEdit}>Save Changes</button>
    </div>
  );
};

export default App;
