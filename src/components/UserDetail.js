import '../styles/UserDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useEffect,useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UserDetail(){   
    const {userId}= useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading]= useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Hàm lấy thông tin user
    const fetchUser = () => {
        fetch(`http://localhost:3001/api/users/${userId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Không thể tải thông tin người dùng!');
                }
                return res.json();
            })
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Lỗi lấy thông tin user:', err);
                setError(err.message);
                setLoading(false);
            });
    };
    useEffect(()=>{
        fetchUser();
    }, [userId]);


    // Hàm cập nhật trạng thái
    const updateStatus = (newStatus) => {
        fetch(`http://localhost:3001/api/users/${userId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Không thể cập nhật trạng thái!');
                }
                return res.json();
            })
            .then((data) => {
                setUser(data);
                alert('Cập nhật trạng thái thành công!'); 
                navigate(-1);
            })
            .catch((err) => {
                console.error('Lỗi cập nhật trạng thái:', err);
                alert('Lỗi cập nhật trạng thái: ' + err.message);
            });
    };
    const handleUpdateRole=()=>{
        fetch(`http://localhost:3001/api/users/${userId}/role`,{
            method:'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({role_id: parseInt(user.role_id)}),
        })
            .then((res)=>{
                if(!res.ok) throw new Error('Không thể cập nhật vai trò');
                return res.json();
            })
            .then((data)=>{
                setUser(data);
                alert('Cập nhật vai trò thành công');
            })
            .catch((err)=>{
                console.error('Lỗi cập nhật vai trò:',err);
                alert('Lỗi cập nhật vai trò:'+err.message);
            });
    }

    if (loading) return <div>Đang tải...</div>;
    if(error) return <div>Lỗi:{error}</div>
    if (!user) {
        return <div>Không tìm thấy thông tin người dùng.</div>;
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: name === 'role_id' ? parseInt(value) : value // Đảm bảo role_id là số
        }));
    };


    const normalizedStatus = (user.status || '').trim().toLowerCase();
    const isActive = normalizedStatus === 'active';

    return(
        <div className="user-detail">
            <div className="tag">
                <h3>Quản lí tài khoản</h3>
            </div>
            <div className="avatar">
                <li><FontAwesomeIcon icon={faUserCircle} size="3x" /></li>
            </div>
            <div className="infor">
                <ul>
                    <li><strong>Id tài khoản: </strong> {user.user_id}</li>
                    <li><strong>Tên tài khoản: </strong> {user.user_name}</li>
                    <li><strong>Email: </strong>{user.email}</li>
                    <li>
                        <strong className='role_id'>Vai trò:</strong>
                            <select
                                id="role_id"
                                name="role_id"
                                value={user.role_id}
                                onChange={handleChange}
                                >
                                <option value={2}>Technical</option>
                                <option value={3}>Content</option>
                                <option value={4}>User</option>
                            </select>
                        <button className='save' onClick={handleUpdateRole}>Lưu</button>
                    </li>
                    <li><strong>Ngày tạo tài khoản: </strong>{new Date(user.created_at).toLocaleDateString('vi-VN')}</li>
                    <li><strong>Trạng thái tài khoản: </strong>{isActive ? 'Active' : 'Banned'}</li>
                </ul>
            </div>
            <div className="actions">
                <button className='ban' onClick={()=> updateStatus('Banned')}  disabled={!isActive}>Banned</button>
                <button className='active' onClick={()=> updateStatus('Active')} disabled={isActive}>Active</button>
            </div>

        </div>
    )
}
export default UserDetail;

