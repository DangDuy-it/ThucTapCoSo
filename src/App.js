import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import HeaderAdmin from "./components/HeaderAdmin";
import DangAnime from "./pages/User/DangAnime";
import Home from "./pages/User/Home";
import TheLoai from "./pages/User/TheLoai";
import Login from "./pages/User/Login";
import Register from "./pages/User/Register";
import MoviePlayer from "./components/MoviePlayer";
import Profile from "./pages/User/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageUser from "./pages/Admin/ManageUser";
import ManageMovie from "./pages/Admin/ManageMovie";
import UserInfor from "./components/UserDetail";
import EditMovie from "./components/EditMovie";
import AddEpisode from "./components/AddEpisode";

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin") || location.pathname.startsWith("/manage");

  return (
    <>
      {isAdminRoute ? <HeaderAdmin /> : <Header />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/dang-anime" element={<DangAnime />} />
        <Route path="/the-loai" element={<TheLoai />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:id" element={<MoviePlayer />} />

        {/* Protected User routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route path="/manageuser" element={<ManageUser />} />
        <Route path="/managemovie" element={<ManageMovie />} />
        <Route path="/user/:userId" element={<UserInfor />} />
        <Route path="/edit/:movieId" element={<EditMovie />} />
        <Route path="/add/:movieId/episode" element={<AddEpisode />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
