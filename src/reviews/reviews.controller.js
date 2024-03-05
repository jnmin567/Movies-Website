const reviewsService = require('./reviews.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await reviewsService.read(reviewId);

  if (review) {
    res.locals.reviewId = reviewId;
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

const properties = ['score', 'content'];
function validProperties(req, _res, next) {
  const { data = {} } = req.body;
  console.log({ data });
  const invalid = Object.keys(data).filter(
    (field) => !properties.includes(field)
  );

  if (invalid.length) {
    return next({
      status: 400,
      message: `Invalid field: ${invalid.join(', ')}`,
    });
  }
  next();
}

async function destroy(_req, res, _next) {
  const { reviewId } = res.locals;
  await reviewsService.delete(reviewId);
  res.sendStatus(204);
}

async function update(req, res, next) {
  const updatedReview = {...res.locals.review, ...req.body.data, review_id: res.locals.review.review_id};
  const criticsInfo = await reviewsService.update(updatedReview);
  updatedReview.critic = criticsInfo;
  res.json({ data: updatedReview });
}

module.exports = {
  update: [asyncErrorBoundary(reviewExists), validProperties, asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
