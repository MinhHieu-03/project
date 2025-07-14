// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./component/tictactoe/Game";
import TestPage from "./pages/TestPage";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang /: không dùng layout */}
        <Route path="/" element={<Game />} />

        {/* Các trang dùng layout chung */}
        <Route path="/" element={<MainLayout />}>
          <Route path="test" element={<TestPage />} />
          {/* Thêm route khác ở đây */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
