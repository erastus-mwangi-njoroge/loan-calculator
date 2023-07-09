import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Main } from "./pages/main/main";
import { Login } from "./pages/login";
import { Navbar } from "./components/navbar";
import { NewLoan } from "./pages/loan-entry/new-loan";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/NewLoan" element={<NewLoan />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
