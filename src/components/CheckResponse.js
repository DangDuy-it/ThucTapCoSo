import React, { useState, useEffect } from 'react';
import '../styles/CheckResponse.css';

function CheckResponse() {
    const [userReports, setUserReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserReports = async () => {
            setLoading(true);
            setError('');
            try {
                const storedUser = localStorage.getItem('user');
                const userId = storedUser ? JSON.parse(storedUser)?.user_id : null;

                if (userId) {
                    const response = await fetch(`http://localhost:3001/api/users/${userId}/bugs`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setUserReports(data);
                } else {
                    setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập.');
                }
            } catch (e) {
                console.error('Lỗi khi lấy báo cáo của người dùng:', e);
                setError('Không thể tải báo cáo của bạn. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserReports();
    }, []);

    if (loading) {
        return <div className="user-xem-response-loading">Đang tải báo cáo của bạn...</div>;
    }

    if (error) {
        return <div className="user-xem-response-error">Lỗi: {error}</div>;
    }

    return (
        <div className="user-xem-response-container">
            <h2>Báo cáo của bạn</h2>
            {userReports.length === 0 ? (
                <p className="no-reports-message">Bạn chưa gửi báo cáo nào.</p>
            ) : (
                <ul className="reports-list">
                    {userReports.map(report => (
                        <li key={report.report_id} className="report-item">
                            <h3>{report.title}</h3>
                            <p className="created-at">
                                Ngày gửi: {new Date(report.created_at).toLocaleDateString('vi-VN')}
                                {' '}
                                {new Date(report.created_at).toLocaleTimeString('vi-VN', { hour: 'numeric', minute: 'numeric' })}
                            </p>
                            {}
                            <p className={`report-status ${report.status === 'resolved' ? 'resolved' : ''}`}>
                                Trạng thái: {report.status === 'pending' ? 'Đang chờ phản hồi' : 'Đã phản hồi'}
                            </p>
                            {report.response ? (
                                <div className="response-details">
                                    <p className="response-date">
                                        Ngày phản hồi: {new Date(report.response.response_date).toLocaleDateString('vi-VN')}
                                        {' '}
                                        {new Date(report.response.response_date).toLocaleTimeString('vi-VN', { hour: 'numeric', minute: 'numeric' })}
                                    </p>
                                    <h4>Nội dung phản hồi:</h4>
                                    <p className="response-content">{report.response.response_text}</p>
                                    <p className="response-signature">
                                        Trân trọng,
                                        <br />
                                        [Đội ngũ Kỹ thuật]
                                    </p>
                                </div>
                            ) : (
                                <p className="no-response">Chưa có phản hồi.</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CheckResponse;