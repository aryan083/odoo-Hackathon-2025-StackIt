import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import QuestionDetail from "./pages/QuestionDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/question/:questionId" element={<QuestionDetail />} />
        <Route path="/questions/:questionId" element={<QuestionDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
