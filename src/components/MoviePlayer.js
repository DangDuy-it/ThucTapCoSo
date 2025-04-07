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
                        Già Thiên kể về Diệp Phàm, một chàng trai ở thế giới hiện tại vô tình bị hút vào chiếc quan tài được kéo bởi chín con rồng, được đưa đến mốt thế giới cổ đại, một thế giới tiên hiệp rộng lớn, kỳ dị và đầy bí ẩn. Hành trình của Diệp Phàm chông gai, và đầy nguy hiểm rình rập, luôn luôn cận kề cái chết, nhưng với sự kiên trì và nghị lực, Diệp Phàm ngày càng nâng cao thực lực bản thân, bước vào con đường tu tiên gian khổ.                    </p>
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