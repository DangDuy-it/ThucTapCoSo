"use client"
import "../styles/Notification.css";
import { Link } from 'react-router-dom';

function Notification(){
    return(
        <div className="Notification">
            <ul>
                <li>Khám phá kho tàng anime vietsub phong phú tại <span>AnimeVietsub!</span></li>
                <li className="login">Đăng nhập để theo dõi tiến độ xem và nhận đề xuất phim phù hợp <Link to="/login"><span>ngay bây giờ!</span></Link></li>
                <li className="report">Nếu trang web gặp lỗi, vui lòng thông báo lỗi <Link to="/report-bug"><span>tại đây!</span></Link></li>
            </ul>
        </div>
    )
}
export default Notification;