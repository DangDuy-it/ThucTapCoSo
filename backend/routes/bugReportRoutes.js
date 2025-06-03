const express = require('express');
const router = express.Router();
const bugController = require('../controllers/bugReportController');

// GET danh sách lỗi
router.get('/api/bugs', bugController.getAllBugReports);

router.get('/api/bugs/:report_id', bugController.getBugReportById);

router.put('/api/bugs/:report_id/resolve', bugController.updateStutus);

router.get('/api/responses/:report_id', bugController.getResponseByBugId);

router.post('/api/response', bugController.postResponseToBug);

router.post('/api/bugs', bugController.createBugReport);

router.get('/api/users/:user_id/bugs', bugController.getUserBugReports);

module.exports = router;