import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import '../styles/ListMovie.css';

function AdminListAll() {
  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage]= useState(1);
  const moviesPerPage= 5;
  const location = useLocation();

  const fetchMovies = useCallback(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');
    let url = 'http://localhost:3001/api/moviesad';

    if (query) {
      url = `http://localhost:3001/api/movies/search?q=${encodeURIComponent(query)}`;
    }

    axios.get(url)
      .then(res => {
        setAnimeList(res.data);
      })
      .catch(err => {
        console.error('Lỗi khi lấy danh sách phim:', err);
        setAnimeList([]);
      });
  }, [location.search]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);
  // Tính tổng số trang
  const totalPages= Math.ceil(animeList.length/moviesPerPage);
  // Tính danh sách phim hiện thị theo trang 
  const indexOfLastMovie= currentPage * moviesPerPage;
  const indexOfFirstMovie= indexOfLastMovie - moviesPerPage;
  const currentMovies= animeList.slice(indexOfFirstMovie, indexOfLastMovie);

  const handlePageChange= (pageNumber) =>{
      setCurrentPage(pageNumber);
  }

  return (
    <div className="list-movies">
      <div className="list-movie-tag">
        <li>Quản lý phim (Tất cả phim)</li>
      </div>
      <div className="button-add">
        <Link to={`/content/add`}>
          <button>THÊM PHIM</button>
        </Link>
      </div>
      <div className="list-movie">
        {animeList.length > 0 ? (
          currentMovies.map(item => (
            <AnimeItem key={item.movie_id} {...item} onDelete={fetchMovies} />
          ))
        ) : (
          <p className="text-center text-gray-500">Không có phim nào.</p>
        )}
      </div>
      <div className="more">
          <ul>
              {Array.from({length: totalPages}, (_, index) =>(
                  <li key={index}>
                      <button className={`page-button ${currentPage === index +1 ? 'active' :''}`} 
                          onClick={()=> handlePageChange(index+1)}
                          >
                          {index+1}
                      </button>
                  </li>
              ))}
          </ul>
      </div>     
    </div>
  );
}

function AnimeItem({ movie_id, title, image_url, genre, year, duration, episodes, status, onDelete }) {
  const getStatusClass = () => status;

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc muốn xóa phim này không?")) {
      axios.delete(`http://localhost:3001/api/movies/${movie_id}`)
        .then(() => {
          alert("Xóa phim thành công!");
          onDelete();
        })
        .catch(err => {
          console.error("Lỗi khi xóa:", err);
          alert("Xóa thất bại!");
        });
    }
  };

  return (
    <div className="movie-item">
      <div className="movie-image">
        <img src={image_url || '/placeholder.jpg'} alt={title} onError={e => e.target.src = '/placeholder.jpg'} />
      </div>
      <div className="movie-info">
        <p><strong>Tên phim:</strong> {title}</p>
        <p><strong>Thể loại:</strong> {genre}</p>
        <p><strong>Năm phát hành:</strong> {year}</p>
        <p><strong>Thời lượng:</strong> {duration} phút</p>
        {episodes && <p><strong>Số tập:</strong> {episodes}</p>}
        <div className={`status ${getStatusClass()}`}>
          <span className="dot" />
          Trạng thái: {status === 'Approved' ? 'Đã duyệt' : 'Chờ duyệt'}
        </div>
      </div>
      <div className="actions">
        <Link to={`/content/edit/${movie_id}`}>
          <button>Sửa thông tin phim</button>
        </Link>
        <button onClick={handleDelete}>Xóa Phim</button>
        <Link to={`/content/episodes/${movie_id}`}>
          <button>Quản lý tập phim</button>
        </Link>
      </div>
    </div>
  );
}

export default AdminListAll;