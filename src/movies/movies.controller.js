const moviesService = require('./movies.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await moviesService.read(movieId);
  if (movie) {
    res.locals.movieId = movieId;
    res.locals.foundMovie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

async function list(req, res, _next) {
  const { is_showing } = req.query;
  if (is_showing === 'true') {
    const data = await moviesService.moviesShowing();
    return res.json({ data });
  }
  const data = await moviesService.list();
  res.json({ data });
}

async function read(_req, res, _next) {
  const data = res.locals.foundMovie;
  res.json({ data });
}

async function theatersShowing(_req, res, _next) {
  const { movieId } = res.locals;
  const data = await moviesService.theatersShowing(movieId);
  res.json({ data });
}

async function listReviews(req, res) {
  const { movieId } = req.params;
  const data = await moviesService.listReviews(movieId);
  res.json({ data });
}

module.exports = {
  read: [asyncErrorBoundary(movieExists), read],
  theatersShowing: [asyncErrorBoundary(movieExists), asyncErrorBoundary(theatersShowing)],
  listReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews)],
  list: asyncErrorBoundary(list),
};
