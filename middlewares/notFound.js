module.exports = (_, response) => {
  response.json({
    error: '404 page not found'
  }).status(404)
}
