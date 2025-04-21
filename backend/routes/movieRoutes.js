const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/api/movies', movieController.getMovies);
router.get('/api/movies/:id', movieController.getMovieDetails);
router.get('/api/moviesad', movieController.getMoviesAdmin);
router.get('/api/movies/:movie_id/edit', movieController.getMovieById);
router.put('/api/movies/:movie_id',movieController.updateMovie);
router.post('/api/movies/:movieId/episodes',movieController.addEpisode);
router.delete('/api/movies/:movie_id', movieController.deleteMovie);

module.exports = router;