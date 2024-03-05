const knex = require('../db/connection');

function list() {
  return knex('movies').select('*');
}

function moviesShowing() {
  return knex('movies as m')
    .join('movies_theaters as mt', 'm.movie_id', 'mt.movie_id')
    .select('*')
    .where('mt.is_showing', true)
    .groupBy('m.movie_id');
}

const listMoviesCurrentlyShowing = () => {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .distinct("m.*")
    .where({ "mt.is_showing": true });
};

function read(movie_id) {
  return knex('movies').select('*').where({ movie_id }).first();
}

function theatersShowing(movie_id) {
  return knex('movies_theaters as mt')
    .join('theaters as t', 'mt.theater_id', 't.theater_id')
    .select('*')
    .where({ movie_id, is_showing: true });
}

function listReviews(movie_id) {
  return knex('reviews')
    .select('*')
    .where({ movie_id })
    .then((movieReviews) => {
      const mappedReviews = movieReviews.map((review) => {
        return knex('critics')
          .select('*')
          .where({ critic_id: review.critic_id })
          .first()
          .then((firstCritic) => {
            review.critic = firstCritic;
            return review;
          });
      });
      const fulfilledReviewsWithCritics = Promise.all(mappedReviews);
      return fulfilledReviewsWithCritics;
    });
}

module.exports = {
  read,
  list,
  moviesShowing,
  theatersShowing,
  listReviews,
  listMoviesCurrentlyShowing,
};
