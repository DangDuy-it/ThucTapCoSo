import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import '../styles/MoviePlayer.css';

const MoviePlayer = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/movies/${id}`);
                const data = await res.json();
                console.log("Phim nhận được:", data);

                if (data.episodes && Array.isArray(data.episodes)) {
                    setMovie(data);
                    if (data.episodes.length > 0) {
                        setCurrentEpisode(data.episodes[0]); // tập đầu
                    }
                } else {
                    setMovie({ ...data, episodes: [] }); // fallback
                }
            } catch (err) {
                console.error("Lỗi:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (loading) return <div>Đang tải...</div>;
    if (!movie) return <div>Không tìm thấy phim!</div>;

    return (
        <div className="movie-player-container">
            <div className="breadcrumb">
                <Link to="/">Trang chủ</Link> / <span>{movie.title}</span> / <span>{currentEpisode?.title}</span>
            </div>

            <div className="video-player">
                <iframe
                    key={currentEpisode?.episode_id}
                    width="100%"
                    height="400"
                    src={currentEpisode?.video_url}
                    title={movie.title}
                    frameBorder="0"
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
                            className={Number(ep.episode) === Number(currentEpisode?.episode) ? "active" : ""}
                            onClick={() => setCurrentEpisode(ep)}
                            >
                            Tập {ep.episode}
                            </button>
                        ))
                    ) : (
                    <p>Chưa có tập phim nào.</p>
                    )}
                </div>
            </div>

            <div className="movie-info">
                <img src={movie.image} alt={movie.title} className="movie-poster" />
                <div className="movie-details">
                    <h3>{movie.title}</h3>
                    <p>{movie.description}</p>
                </div>
            </div>

            <div className="comment-section">
                <h3>BÌNH LUẬN</h3>
                <textarea placeholder="Viết bình luận của bạn..."></textarea>
                <button className="comment-button">GỬI</button>
            </div>
        </div>
    );
};

export default MoviePlayer;
