import {Routes,Route} from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import HeaderAdmin from "./components/HeaderAdmin";
import HeaderContent from "./components/HeaderContent";
import HeaderTechnical from "./components/HeaderTechnical";
import DangAnime from "./pages/User/DangAnime";
import Home from "./pages/User/Home";
import Login from "./pages/User/Login";
import Register from "./pages/User/Register";
import MoviePlayer from "./components/MoviePlayer";
import Profile from "./pages/User/Profile";
import ManageUser from "./pages/Admin/ManageUser";
import ManageMovie from "./pages/Admin/ManageMovie";
import UserInfor from "./components/UserDetail";
import EditMovie from "./components/EditMovie";
import AddEpisode from "./components/AddEpisode";
import SearchResults from "./pages/User/PageSearch";
import CategoryMovies from "./pages/User/TheLoai";
import AddMovie from "./components/AddMovie";
import Favorites from "./pages/User/FavoritesList";
import MovieDetail from "./pages/User/MovieDetail";
import WatchHistoryList from "./pages/User/WatchHistoryList";
import MovieDetailAdmin from "./pages/Admin/MovieDetail";
import ListSearchUser from "./pages/Admin/ListSearchUser";
import ListSearchMovie from "./pages/Admin/ListSearchMovie";
import ApprovedMovies from "./pages/ContentManager/ApprovedMovies";
import PendingMovies from "./pages/ContentManager/PendingMovies";
import ContentMovies from "./pages/ContentManager/ContentMovies";
import EpisodesContent from './pages/ContentManager/EpisodesContent';
import BugList from "./pages/Technical/BugList";
import BugResponse from "./pages/Technical/BugResponse";
import ReportBug from "./pages/User/ReportBug";
import CheckResponse from "./pages/User/CheckResponse";
import { FilterProvider } from "./components/FilterContext";
import Forgot from "./pages/User/Forgot";

export default function Layout() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || { role: "user" });

        useEffect(() => {
            const handleUserChanged = () => {
                const updatedUser = JSON.parse(localStorage.getItem("user")) || { role: "user" };
                console.log("User updated:", updatedUser); // Debug
                setUser(updatedUser);
            };

            window.addEventListener("userChanged", handleUserChanged);

            return () => {
                window.removeEventListener("userChanged", handleUserChanged);
            };
        }, []);

    const renderHeader=()=>{
      console.log("Current user role:", user.role);
      switch (user.role){
        case "admin":
          return <HeaderAdmin/>;
        case "content_manager":
          return <HeaderContent/>;
        case "technical":
          return <HeaderTechnical/>;
        case "user":
        default:
          return <Header/>;
      }
    };

    return (
      <>
      <FilterProvider>
        {renderHeader()}
        <Routes>
                {/* Các Route của Người dùng */}
                <Route path="/" element={<Home />} />
                <Route path="/dang-anime" element={<DangAnime />} />
                <Route path="/the-loai/:name" element={<CategoryMovies />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/movie/:id/episode/:episodeNumber" element={<MoviePlayer />} />
                <Route path="/movies/search" element={<SearchResults />} />
                <Route path="/movies/favorites" element={<Favorites/>}/>
                <Route path="/movieDetail/:id" element={<MovieDetail/>}/>
                <Route path="/movies/watch-history" element={<WatchHistoryList />} />
                <Route path="/report-bug" element={<ReportBug />} />
                <Route path="/check-response" element={<CheckResponse/>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/forgot-password" element={<Forgot />} />

                {/* Các Route của Quản trị viên */}
                <Route path="/admin/manage-user" element={<ManageUser />} />
                <Route path="/admin/manage-movie" element={<ManageMovie />} />
                <Route path="/admin/moviedetail/:movieId" element={<MovieDetailAdmin/>}/>
                <Route path="/admin/user/:userId" element={<UserInfor />} />
                <Route path="/admin/search-users" element={<ListSearchUser />} />
                <Route path="/admin/search-movies" element={<ListSearchMovie />} />

                {/* Các Route của Quản lý nội dung */}
                <Route path="/content/add" element={<AddMovie />} />
                <Route path="/content/edit/:movieId" element={<EditMovie />} />
                <Route path="/content/movies/all" element={<ContentMovies/>}/>
                <Route path="/content/movies/approved" element={<ApprovedMovies/>} />
                <Route path="/content/movies/pending" element={<PendingMovies/>} />
                <Route path="/content/episodes/:movie_id" element={<EpisodesContent />} />
                <Route path="/content/movies/search-all" element={<ContentMovies />} />
                <Route path="/content/movies/search-approved" element={<ApprovedMovies />} />
                <Route path="/content/movies/search-pending" element={<PendingMovies />} />
        
                {/* Các Route của Kỹ thuật viên */}       
                <Route path="/technical" element={<BugList />} />
                <Route path="/technical/responsed" element={<BugList />} />
                <Route path="/technical/unresponse" element={<BugList />} />
                <Route path="/technical/detail/:report_id" element={<BugResponse />} />
        </Routes>
     </FilterProvider>
      </>
    );
  }
  