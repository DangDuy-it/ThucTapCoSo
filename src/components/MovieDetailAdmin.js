import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/MovieDetailAdmin.css'; // Đảm bảo file CSS này tồn tại và được định nghĩa đúng

function MovieDetailAdmin() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movieRes = await axios.get(`http://localhost:3001/api/movies/${movieId}/edit`);
                setMovie(movieRes.data);
            } catch (err) {
                setError('Không thể tải thông tin phim.');
                console.error("Lỗi khi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [movieId]);

const handleStatusUpdate = async (newStatusText) => {
        // Map the display text to the English status expected by the backend
        let statusToSend;
        if (newStatusText === 'Approved') { // This should be 'Duyệt' for the button text
            statusToSend = 'Approved';
        } else if (newStatusText === 'Pending') { // This should be 'Từ chối' for the button text
            statusToSend = 'Pending';
        } else {
            // This case should ideally not be reached if buttons are correctly configured
            console.error("Trạng thái không xác định:", newStatusText);
            return;
        }

        const confirmed = window.confirm(`Bạn có chắc chắn muốn ${newStatusText.toLowerCase()} phim này không?`);
        if (!confirmed) return;

        try {
            // Send the English status to the backend
            await axios.put(`http://localhost:3001/api/movies/${movieId}/status`, { status: statusToSend });
            setMovie(prev => ({ ...prev, status: statusToSend })); // Update local state with English status
            alert(`Phim đã được ${newStatusText} thành công!`);
            navigate('/admin/manage-movie');
        } catch (err) {
            console.error(`Lỗi khi cập nhật phim:`, err);
            setError(`Không thể cập nhật trạng thái phim. Vui lòng thử lại sau.`);
        }
    };


    if (loading) {
        return <div className="loading-message">Đang tải thông tin phim...</div>;
    }
    if (error) {
        return <div className="error-message">Lỗi: {error}</div>;
    }
    if (!movie) {
        return <div className="not-found-message">Không tìm thấy phim.</div>;
    }
    const getStatusClass = (status) => {
        if (status === 'Approved') return ' Approved';
        if (status === 'Pending') return ' Pending';
        return 'review';
    };
    return (
        <div className="movie-detail-admin-container">
            <div className="movie-detail-header">
                <div className="movie-detail-poster">
                    <img
                        src={movie.image_url || '/placeholder.jpg'}
                        alt={movie.title}
                        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                    />
                </div>
                <div className="movie-info-details">
                    <h2>{movie.title}</h2>
                    <p className="movie-detail-status">
                        <strong>Trạng thái:</strong>
                        <span className={getStatusClass(movie.status)}>{getStatusClass(movie.status)}</span>
                    </p>
                    <p><strong>Thể loại:</strong> {movie.genre}</p>
                    <p><strong>Năm phát hành:</strong> {movie.release_year}</p>
                    <p><strong>Thời lượng:</strong> {movie.duration} phút</p>
                    <p><strong>Số tập:</strong> {movie.episodes_count}</p>
                </div>
            </div>
            <div className="movie-description">
                <p className="movie-description-text">{movie.description}</p>
            </div>

            <div className="action-buttons-container">
                <button
                    className="action-button-admin reject-button"
                    onClick={() => handleStatusUpdate('Pending')} 
                    disabled={movie.status === 'Pending'}
                >
                    Từ chối
                </button>
                <button
                    className="action-button-admin approve-button"
                    onClick={() => handleStatusUpdate('Approved')} 
                    disabled={movie.status === 'Approved'}
                >
                    Duyệt
                </button>
            </div>
        </div>
    );
}

export default MovieDetailAdmin;