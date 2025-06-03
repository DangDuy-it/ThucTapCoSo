import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/DetailReport.css";

const DetailReport = () => {
  const { report_id } = useParams();
  const [reportDetail, setReportDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [responseContent, setResponseContent] = useState(null);

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const fetchReportDetail = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const bugRes = await axios.get(`http://localhost:3001/api/bugs/${report_id}`);
      const bugDataArray = bugRes.data;
      if (bugDataArray && bugDataArray.length > 0) {
        const bugData = bugDataArray[0];
        const userRes = await axios.get(`http://localhost:3001/api/users/${bugData.user_id}`);
        setReportDetail({ ...bugData, userEmail: userRes.data.email });
      } else {
        setError("Không tìm thấy thông tin lỗi.");
      }
    } catch (err) {
      setError("Không thể tải chi tiết lỗi.");
      console.error("Lỗi tải chi tiết lỗi:", err);
    } finally {
      setLoading(false);
    }
  }, [report_id]);

  const fetchResponse = async () => {
    try {
      const responseRes = await axios.get(`http://localhost:3001/api/responses/${report_id}`);
      setResponseContent(responseRes.data);
    } catch (error) {
      console.error("Lỗi tải phản hồi:", error);
      setResponseContent(null);
    }
  };

  const handleXemPhanHoiClick = () => {
    setShowResponse(!showResponse);
    setShowReplyForm(false);
    if (!showResponse) {
      fetchResponse();
    }
  };

  const handleVietPhanHoiClick = () => {
    setShowReplyForm(true);
    setShowResponse(false);
  };

  const handleReplyTextChange = (event) => {
    setReplyText(event.target.value);
  };

  const handleGuiPhanHoiClick = async () => {
    try {
      await axios.post("http://localhost:3001/api/response", {
        report_id: reportDetail.report_id,
        response_text: replyText,
      });
      setReportDetail({ ...reportDetail, status: "resolved" });
      setShowReplyForm(false);
      // Có thể fetch lại detail hoặc hiển thị thông báo
    } catch (error) {
      console.error("Lỗi gửi phản hồi:", error);
      setError("Không thể gửi phản hồi.");
    }
  };

  useEffect(() => {
    fetchReportDetail();
  }, [report_id, fetchReportDetail]);

  if (loading) return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!reportDetail) return <div>Không tìm thấy thông tin lỗi.</div>;

  return (
    <div className="detail-report-container">
      <div className="title">TEAM KỸ THUẬT!</div>
      <div className="subtitle">Xem báo cáo lỗi!</div>

      <div className="info-item">
        <span className="label">Account:</span>
        <span className="value">{reportDetail.userEmail}</span>
      </div>
      <div className="info-item">
        <span className="label">Thời gian:</span>
        <span className="value">{formatDate(reportDetail.created_at)}</span>
      </div>
      <div className="info-item">
        <span className="label">Tình trạng:</span>
        <span className={`value status-${reportDetail.status === 'resolved' ? 'resolved' : 'pending'}`}>
          {reportDetail.status === 'resolved' ? 'Đã phản hồi' : 'Chưa phản hồi'}
        </span>
      </div>
      <div className="info-item">
        <span className="label">Nội dung lỗi:</span>
        <span className="value">{reportDetail.title}</span>
      </div>
      <div className="info-item">
        <span className="label">Mô tả chi tiết lỗi:</span>
        <span className="value">{reportDetail.description}</span>
      </div>

      {reportDetail?.status === 'pending' && showReplyForm && (
        <div className="reply-form">
          <textarea
            value={replyText}
            onChange={handleReplyTextChange}
            placeholder="Nhập phản hồi..."
            className="reply-form-textarea"
          />
          <button onClick={handleGuiPhanHoiClick} className="reply-form-button">Gửi phản hồi</button>
        </div>
      )}

      {reportDetail?.status === 'resolved' && (
        <button className="response-button" onClick={handleXemPhanHoiClick}>
          {showResponse ? 'Ẩn phản hồi' : 'Xem phản hồi'}
        </button>
      )}

      {reportDetail?.status === 'pending' && !showReplyForm && (
        <button className="response-button" onClick={handleVietPhanHoiClick}>
          Viết phản hồi
        </button>
      )}

      {showResponse && responseContent && (
        <div className="response-display">
          <p><b>Thời gian phản hồi:</b> {formatDate(responseContent?.response_time)}</p>
          <p><b>Nội dung:</b> {responseContent?.response_text}</p>
          <div className="response-signature">
            Trân trọng,<br />
            [Đội ngũ Kỹ thuật]
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailReport;