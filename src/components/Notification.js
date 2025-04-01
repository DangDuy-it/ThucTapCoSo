"use client"
import "../styles/Notification.css";

function Notification(){
    return(
        <div className="Notification">
          <ul>
            <li>Chào mừng bạn đến <span>AnimeVietsub!</span></li>
            <li>Lấy dữ liệu lịch sử xem, đăng nhập từ tên miền cũ <span>tại đây!</span>  </li>
            <li>Nếu trang web gặp lỗi, vui lòng thông báo lỗi tại đây: <span>Báo lỗi tại đây!</span></li>
          </ul>
        </div>
    )
  }
export default Notification;