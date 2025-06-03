import React, { useState, useEffect } from 'react';
import '../styles/ReportBugForm.css';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function ReportBugForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const commonErrors = [
        "Lỗi phát phim",
        "Không thể đăng nhập",
        "Trình duyệt không được hỗ trợ",
        "Web không hoạt động"
    ];
    const navigate = useNavigate();
    const storedUser = localStorage.getItem('user');
    const isLoggedIn = !!storedUser;

    useEffect(() => {
        if (!isLoggedIn) {
            toast.info("Bạn cần đăng nhập để báo cáo lỗi.");
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleCommonErrorClick = (errorText) => {
        setTitle(errorText);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isLoggedIn) {
            toast.error("Bạn cần đăng nhập để báo cáo lỗi.");
            navigate('/login');
            return;
        }

        if (!title.trim()) {
            setError('Vui lòng nhập tiêu đề lỗi.');
            return;
        }

        if (!description.trim()) {
            setError('Vui lòng mô tả chi tiết sự cố.');
            return;
        }

        try {
            const userId = storedUser ? JSON.parse(storedUser)?.user_id : null;

            const response = await fetch('http://localhost:3001/api/bugs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, userId: userId }),
            });

            if (response.ok) {
                setSubmitted(true);
                setError('');
                setTitle('');
                setDescription('');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Đã có lỗi xảy ra khi gửi báo cáo.');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
            setError('Đã có lỗi xảy ra khi gửi báo cáo.');
        }
    };

    if (submitted) {
        return (
            <div className="report-bug-form-styled">
                <h2>Báo cáo sự cố thành công!</h2>
                <p>Cảm ơn bạn đã thông báo. Chúng tôi sẽ xem xét vấn đề này sớm nhất có thể.</p>
                <p>
                    <Link to="/xem-response" className="view-reports-link">Xem lỗi của bạn tại đây</Link>
                </p>
            </div>
        );
    }

    // Nếu đã đăng nhập, hiển thị form báo cáo lỗi
    return (
        <div className="report-bug-form-styled">
            <h2>Liên hệ với chúng tôi</h2>
            <p>Hãy chia sẻ thêm và chúng tôi sẽ tìm giải pháp tốt nhất cho bạn</p>

            <div className="form-group">
                <label htmlFor="title">Tiêu đề lỗi:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Nhập tiêu đề lỗi"
                />
            </div>

            <div className="form-group description-group">
                <label htmlFor="description">Mô tả sự cố của bạn:</label>
                <div className="description-input">
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Nhập mô tả chi tiết"
                        className="no-resize"
                    />
                    <button onClick={handleSubmit} className="arrow-button">&#8594;</button>
                </div>
            </div>

            <div className="common-errors-list">
                <h3>Các lỗi thường gặp</h3>
                <ul>
                    {commonErrors.map((error, index) => (
                        <li key={index} onClick={() => handleCommonErrorClick(error)}>
                            {error}
                        </li>
                    ))}
                </ul>
            </div>
            {error && <p className="error-message">{error}</p>}
            <p>
                <Link to="/xem-response" className="view-reports-link">Xem lỗi của bạn</Link>
            </p>
        </div>
    );
}

export default ReportBugForm;