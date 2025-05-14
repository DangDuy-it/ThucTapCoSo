import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/MoviePlayer.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MoviePlayer = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(10);
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();

        // Hàm xử lý lỗi token tập trung
    const handleTokenError = (err) => {
        // Cập nhật điều kiện kiểm tra thông báo lỗi để khớp với auth.js
        if (err.response && err.response.status === 403 && err.response.data?.error === 'Token không hợp lệ hoặc đã hết hạn') {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            localStorage.removeItem("token"); // Xóa token cũ/hết hạn
            navigate("/login"); // Điều hướng đến trang đăng nhập
            return true; // Báo hiệu là đã xử lý lỗi token
        }
        return false; // Báo hiệu chưa xử lý lỗi token cụ thể này
    };
    // Effect hook để fetch tất cả dữ liệu cần thiết khi component mount hoặc id thay đổi
   useEffect(() => {
        // Gộp tất cả các thao tác fetch vào một hàm async duy nhất
        const fetchMovieData = async () => {
            try {
                // 1. Fetch Chi tiết Phim
                // Gọi API backend để lấy chi tiết phim
                const movieRes = await fetch(`http://localhost:3001/api/movies/${id}`);
                const movieData = await movieRes.json();

                // Kiểm tra nếu có tập phim và là mảng
                if (movieData.episodes && Array.isArray(movieData.episodes)) {
                    setMovie(movieData); // Cập nhật state movie
                    // Nếu có tập phim, set tập đầu tiên làm tập hiện tại
                    if (movieData.episodes.length > 0) {
                        setCurrentEpisode(movieData.episodes[0]);
                         //Ghi lịch sử xem phim (chỉ khi có tiêu đề)
                         if (movieData.title) {
                             recordHistory(movieData.title, id);
                         }
                    }
                } else {
                    // Nếu không có tập phim, là mảng rỗng
                    setMovie({ ...movieData, episodes: [] });
                     // Ghi lịch sử ngay cả khi không có tập, nếu thông tin phim tồn tại
                     if (movieData && movieData.title) {
                         recordHistory(movieData.title, id);
                     }
                }

                // 2. Fetch Đánh giá phim
                // Gọi API backend để lấy danh sách đánh giá
                const reviewsRes = await axios.get(`http://localhost:3001/api/reviews/${id}`);
                setReviews(reviewsRes.data); // Cập nhật state reviews

                // 3. Fetch Trạng thái Yêu thích từ backend (Chỉ khi có token)
                const token = localStorage.getItem("token"); // Lấy token
                if (token) { // Nếu có token (người dùng đã đăng nhập)
                     try {
                        // Gọi API backend để kiểm tra trạng thái yêu thích của phim cho người dùng này
                        const statusRes = await axios.get(`http://localhost:3001/api/favorites/${id}/status`, {
                            headers: { Authorization: `Bearer ${token}` }, // Gửi token trong header để xác thực
                        });
                        // Cập nhật state isFavorite dựa trên phản hồi từ backend
                        setIsFavorite(statusRes.data.isFavorite);
                     } catch (statusErr) { // Đã đổi tên biến lỗi thành statusErr cho rõ ràng
                          console.error("Lỗi kiểm tra trạng thái yêu thích:", statusErr.response?.data || statusErr);
                          // Sử dụng hàm xử lý lỗi token. Nếu không phải lỗi token, hiển thị lỗi khác
                          if (!handleTokenError(statusErr)) {
                              // Nếu có lỗi khác khi fetch status, giả định là không yêu thích và thông báo lỗi
                             setIsFavorite(false);
                             toast.error("Không thể kiểm tra trạng thái yêu thích.");
                          }
                      }
                 } else {
                      // Nếu không có token (người dùng chưa đăng nhập), set isFavorite là false
                      setIsFavorite(false);
                 }

            } catch (err) {
                // Xử lý lỗi chung cho bất kỳ fetch nào trong khối try lớn
                console.error("Lỗi fetch dữ liệu phim:", err);
                 toast.error("Không thể tải dữ liệu phim."); // Hiển thị thông báo lỗi cho người dùng
            } finally {
                // Dù thành công hay thất bại, kết thúc trạng thái loading
                setLoading(false);
            }
        };

        // Gọi hàm fetch tất cả dữ liệu khi effect chạy
        fetchMovieData();

        // Dependencies của useEffect: Effect sẽ chạy lại khi id thay đổi
    }, [id]);
    // Hàm xử lý gửi đánh giá mới 
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để gửi đánh giá!");
            navigate("/login");
            return;
        }

        try {
            await axios.post(
                "http://localhost:3001/api/reviews",
                { movie_id: id, rating, comment: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewComment("");
            setRating(10);
            const res = await axios.get(`http://localhost:3001/api/reviews/${id}`);
            setReviews(res.data);
            toast.success("Đánh giá thành công!");
        } catch (err) {
            toast.error(
                "Lỗi khi gửi đánh giá: " + (err.response?.data?.error || "Thử lại sau")
            );
        }
    };
    // Hàm xử lý thêm/xóa phim khỏi danh sách yêu thích
    const toggleFavorite = async() => {
        const token = localStorage.getItem("token");
        // Kiểm tra người dùng đã đăng nhập chưa
        if (!token) {
            toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
            navigate("/login");
            return;
        }
        try {
            if(isFavorite) {
                // Nếu phim đang yêu thích, gửi yêu cầu DELETE để xóa
                await axios.delete(`http://localhost:3001/api/favorites/${id}`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setIsFavorite(false);
                toast.success("Đã xóa khỏi danh sách yêu thích");
            } else{
                // Nếu phim chưa yêu thích, gửi yêu cầu POST để thêm
                await axios.post(`http://localhost:3001/api/favorites`, {movie_id:id}, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setIsFavorite(true);
                toast.success("Đã thêm vào danh sách yêu thích");
            }
        }
        catch (err) {
            console.error("Lỗi khi cập nhật yêu thích:", err.response?.data || err);
            if (!handleTokenError(err)) {
                 // Nếu lỗi không phải do token hết hạn/sai, thì hiển thị lỗi khác
                 toast.error(
                     "Có lỗi khi cập nhật yêu thích: " + (err.response?.data?.message || "Thử lại sau") // Hiển thị thông báo lỗi từ server nếu có
                 );
             }
        }

    };
    // Hàm ghi lịch sử xem phim
    const recordHistory = (title, movieId) => {
        const history = JSON.parse(localStorage.getItem("watchHistory") || "[]");
        const newEntry = { id: movieId, title, timestamp: new Date().toISOString() };
        const updatedHistory = [
            newEntry,
            ...history.filter((item) => item.id !== movieId),
        ].slice(0, 10);
        localStorage.setItem("watchHistory", JSON.stringify(updatedHistory));
    };

    if (loading) return <div>Đang tải...</div>;
    if (!movie) return <div>Không tìm thấy phim!</div>;

    return (
        <div className="movie-player-container">
            <div className="breadcrumb">
                <Link to="/">Trang chủ</Link> / <span>{movie.title}</span> /{" "}
                <span>{currentEpisode?.title}</span>
            </div>
            <div className="video-player">
                <iframe
                    key={currentEpisode?.episode_id}
                    width="100%"
                    height="400"
                    src={currentEpisode?.video_url}
                    title={movie.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <div className="episode-list">
                <h3>DANH SÁCH TẬP</h3>
                <div className="episodes">
                    {Array.isArray(movie.episodes) && movie.episodes.length > 0 ? (
                        movie.episodes.map((ep) => (
                            <button
                                key={ep.episode_id}
                                className={
                                    Number(ep.episode) === Number(currentEpisode?.episode)
                                        ? "active"
                                        : ""
                                }
                                onClick={() => {
                                    setCurrentEpisode(ep);
                                    recordHistory(movie.title, id);
                                }}
                            >
                                Tập {ep.episode}
                            </button>
                        ))
                    ) : (
                        <p>Chưa có tập phim nào.</p>
                    )}
                </div>
            </div>
            <div className="movie-player-info">
                <div className="poster-container">
                    <img src={movie.image_url} alt={movie.title} className="movie-poster" />
                    
                    <button
                        onClick={toggleFavorite}
                        className={`favorite-btn ${isFavorite ? "remove-favorite" : "add-favorite"}`} // Thêm class động
                    >
                        {isFavorite
                            ? "Xóa khỏi danh sách yêu thích"
                            : "Thêm vào danh sách yêu thích"}
                    </button>
                </div>
                <div className="movie-details">
                    <h3>{movie.title}</h3>
                    <p>{movie.description}</p>
                </div>
            </div>
            <div className="review-section">
                <h3>ĐÁNH GIÁ</h3>
                <form onSubmit={handleReviewSubmit}>
                    <div className="rating-input">
                        <label>Điểm đánh giá (1-10): </label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            required
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </div>
                    <textarea
                        placeholder="Viết đánh giá của bạn..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit" className="review-button">
                        GỬI ĐÁNH GIÁ
                    </button>
                </form>
                <div className="reviews-list">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.review_id} className="review">
                                <p>
                                    <strong>{review.user_name}</strong> (
                                    {new Date(review.review_date).toLocaleString()}) -
                                    <span className="rating"> Điểm: {review.rating}/10</span>
                                </p>
                                <p>{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>Chưa có đánh giá nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoviePlayer;