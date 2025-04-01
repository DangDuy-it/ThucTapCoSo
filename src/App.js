import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import DangAnime from "./pages/DangAnime"; // Import giao diện Dạng Anime
import Home from "./pages/Home"; // Import giao diện Trang chủ
import TheLoai from "./pages/TheLoai";
import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
  return (
    <div className="App">

    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Trang chủ */}
        <Route path="/dang-anime" element={<DangAnime />} /> {/* Dạng Anime */}
        <Route path="/the-loai" element={<TheLoai />} /> {/* Dạng Anime */}
        <Route path="/login" element={<Login/>}></Route>
        <Route path="register" element={<Register/>}></Route>
      </Routes>
    </Router>
    </div>
  );
}

export default App;

