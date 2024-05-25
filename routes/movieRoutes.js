const express = require('express');
const passport = require('passport');
const db = require('../models');

const router = express.Router();

router.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const limit = 10;
  const offset = req.query.page ? (req.query.page - 1) * limit : 0;
  const movies = await db.movies.findAndCountAll({ limit, offset });
  res.json(movies);
});

router.post('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const newMovie = await db.movies.create(req.body);
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/movies/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await db.movies.findByPk(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    await movie.update(req.body);
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/movies/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await db.movies.findByPk(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    await movie.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
