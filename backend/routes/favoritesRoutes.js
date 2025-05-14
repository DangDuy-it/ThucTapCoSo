const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const { authenticateToken } = require('../middlewares/auth');

// Use POST for adding a new favorite
router.post('/api/favorites', authenticateToken, favoritesController.addFavorite);

// Use DELETE to remove a favorite, specify movie_id in URL
router.delete('/api/favorites/:movieId', authenticateToken, favoritesController.removeFavorite);

// Use GET to check favorite status, specify movie_id in URL
router.get('/api/favorites/:movieId/status', authenticateToken, favoritesController.checkFavoriteStatus);


module.exports = router;