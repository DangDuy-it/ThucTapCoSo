const { response } = require("express");
const db = require("../config/db");

// Lấy danh sách các lỗi
const getAllBugReports = (req, res) => {
  const sql = "SELECT * FROM bug_reports";
  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Lỗi truy vấn bug_reports" });
    res.json(result);
  });
};

const getBugReportById = (req, res) => {
  const reportId = req.params.report_id;
  const sql = "SELECT * FROM bug_reports WHERE report_id = ?";
  db.query(sql, [reportId], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Lỗi truy vấn chi tiết lỗi" });
    if (result.length === 0)
      return res.status(404).json({ message: "Không tìm thấy lỗi" });
    res.json(result); // Trả về object lỗi duy nhất
  });
};

const updateStutus = (req, res) => {
  const reportId = req.params.report_id;
  const sql = "UPDATE bug_reports SET status = 'resolved', updated_at = NOW() WHERE report_id = ?";
  db.query(sql, [reportId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi cập nhật trạng thái' });
    res.json({ message: 'Cập nhật trạng thái thành công' });
  });
}

const getResponseByBugId = (req, res) => {
  const reportId = req.params.report_id;
  const sql = `
    SELECT br.response_text, br.response_date AS response_time
    FROM bug_responses br
    WHERE br.report_id = ?
  `;
  db.query(sql, [reportId], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn phản hồi:", err);
      return res.status(500).json({ message: "Lỗi khi lấy phản hồi." });
    }
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: "Không tìm thấy phản hồi cho lỗi này." });
    }
  });
};

const postResponseToBug = (req, res) => {
  const { report_id, response_text } = req.body;
  const sqlInsertResponse = `
    INSERT INTO bug_responses (report_id, response_text, response_date)
    VALUES (?, ?, NOW())
  `;
  db.query(sqlInsertResponse, [report_id, response_text], (err, result) => {
    if (err) {
      console.error("Lỗi khi chèn phản hồi:", err);
      return res.status(500).json({ message: "Lỗi khi lưu phản hồi." });
    }

    // Sau khi lưu phản hồi thành công, cập nhật trạng thái của bug report
    const sqlUpdateReport = `
      UPDATE bug_reports
      SET status = 'resolved', updated_at = NOW()
      WHERE report_id = ?
    `;
    db.query(sqlUpdateReport, [report_id], (errUpdate) => {
      if (errUpdate) {
        console.error("Lỗi khi cập nhật trạng thái lỗi:", errUpdate);
        return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái lỗi." });
      }
      res.json({ message: "Phản hồi đã được gửi và trạng thái lỗi đã được cập nhật." });
    });
  });
};

//API POST lỗi, thêm vào bảng bug_reports từ phía người dùng gửi
const createBugReport = async (req, res) => {
    try {
        const { title, description, userId } = req.body;

        const query = 'INSERT INTO bug_reports (title, description, user_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';
        const values = [title, description, userId, 'pending'];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Lỗi khi tạo báo lỗi:', err);
                return res.status(500).json({ message: 'Đã có lỗi xảy ra khi gửi báo lỗi.' });
            }
            res.status(201).json({ message: 'Báo lỗi thành công!', reportId: result.insertId });
        });
    } catch (error) {
        console.error('Lỗi không mong muốn:', error);
        res.status(500).json({ message: 'Đã có lỗi xảy ra khi gửi báo lỗi.' });
    }
};

const getUserBugReports = (req, res) => {
    const userId = req.params.user_id;
    const query = `
        SELECT
            br.report_id,
            br.title,
            br.description,
            br.status,
            br.created_at,
            br.updated_at,
            r.response_id,
            r.response_text,
            r.response_date
        FROM bug_reports br
        LEFT JOIN bug_responses r ON br.report_id = r.report_id
        WHERE br.user_id = ?
        ORDER BY br.created_at DESC;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy báo cáo lỗi của người dùng:', err);
            return res.status(500).json({ message: 'Đã có lỗi xảy ra khi lấy báo cáo.' });
        }

        const formattedResults = results.reduce((acc, row) => {
            const reportIndex = acc.findIndex(item => item.report_id === row.report_id);

            if (reportIndex === -1) {
                acc.push({
                    report_id: row.report_id,
                    title: row.title,
                    description: row.description,
                    status: row.status,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    response: row.response_id ? {
                        response_id: row.response_id,
                        response_text: row.response_text,
                        response_date: row.response_date
                    } : null,
                });
            }

            return acc;
        }, []);

        res.status(200).json(formattedResults);
    });
};


module.exports = {
  getAllBugReports,
  updateStutus,
  getBugReportById,
  getResponseByBugId,
  postResponseToBug,
  createBugReport,
  getUserBugReports,
};