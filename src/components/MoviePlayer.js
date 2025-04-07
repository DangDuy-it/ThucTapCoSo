import React from "react";
import { useParams, Link } from "react-router-dom";
import { AnimeList } from './Datalist';
import '../styles/MoviePlayer.css'; // Import file CSS

const MoviePlayer = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const movie = AnimeList.find((m) => m.id === parseInt(id)); // Tìm phim theo ID

    if (!movie) {
        return <div>Phim không tồn tại!</div>;
    }

    // Dữ liệu giả lập cho danh sách tập
    const episodes = [
        { episode: 1, title: "Tập 1" },
        { episode: 2, title: "Tập 2" },
        { episode: 3, title: "Tập 3" },
        { episode: 4, title: "Tập 4" },
    ];

    // Giả lập quốc gia/thể loại (có thể lấy từ List nếu có dữ liệu)
    const country = "Trung Quốc";
    const currentEpisode = "Tập 1"; // Có thể động hóa nếu cần

    // Dữ liệu giả lập cho bình luận
    const comments = [
        { user: "User1", comment: "Phim hay quá!" },
        { user: "User2", comment: "Tập này cảm động thật sự." },
    ];

    return (
        <div className="movie-player-container">
            {/* Tiêu đề phim breadcrumb */}
            <div className="breadcrumb">
                <Link to="/">Trang chủ</Link> / <span>{country}</span> / <span>{movie.title}</span> / <span>{currentEpisode}</span>
            </div>

            {/* Video Player */}
            <div className="video-player">
                <video width="100%" controls>
                    <source src={movie.videoUrl} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                </video>
            </div>

            {/* Danh sách tập */}
            <div className="episode-list">
                <h3>DANH SÁCH TẬP</h3>
                <div className="episodes">
                    {episodes.map((ep) => (
                        <button key={ep.episode} className={ep.episode === 1 ? "active" : ""}>
                            {ep.episode}
                        </button>
                    ))}
                </div>
            </div>

            {/* Thông tin phim */}
            <div className="movie-info">
                <img src={movie.image} alt={movie.title} className="movie-poster" />
                <div className="movie-details">
                    <h3>GIA THIÊN</h3>
                    <p>
                        Phim bộ độ nét cao miễn phí trên web A-E. Gia Thiên là bộ phim chuyển thể từ tiểu thuyết cùng tên của tác giả Thần Đông. Bộ phim kể về hành trình tu luyện của Diệp Phàm, một chàng trai trẻ từ Trái Đất bị đưa đến một thế giới tu tiên đầy bí ẩn. Tại đây, anh phải đối mặt với nhiều thử thách, kẻ thù mạnh mẽ, và những bí mật kinh thiên động địa liên quan đến vận mệnh của vũ trụ. Bộ phim hứa hẹn mang đến những cảnh quay hoành tráng, kỹ xảo đẹp mắt cùng câu chuyện hấp dẫn, lôi cuốn người xem.
                    </p>
                </div>
            </div>

            {/* Bình luận */}
            <div className="comment-section">
                <h3>BÌNH LUẬN</h3>
                <div className="comments">
                    {comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <strong>{comment.user}:</strong> {comment.comment}
                        </div>
                    ))}
                </div>
                <textarea placeholder="Viết bình luận của bạn..."></textarea>
                <button className="comment-button">GỬI</button>
            </div>

        </div>
    );
};

export default MoviePlayer;