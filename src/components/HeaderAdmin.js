import {Link} from 'react-router-dom';
import '../styles/Header.css';

function HeaderAdmin(){
    return(
        <nav>
            <div className="logo">
                <img src="https://cdn.animevietsub.one/data/logo/logoz.png" alt="Logo" />
            </div>
            <div className="header">
                <ul>
                    <li><Link to="/manageuser">QUẢN LÝ TÀI KHOẢN</Link></li>
                    <li><Link to="/managemovie">QUẢN LÝ PHIM</Link></li>  
                </ul>
            </div>
            <div className="search">
                <ul>
                    <li><input placeholder = "Tìm kiếm "type="text" /></li>
                </ul>
            </div>
            <div className="user-infor">
                <ul>
                    <li>Admin</li>
                </ul>
            </div>
        </nav>
    );
};
export default HeaderAdmin;