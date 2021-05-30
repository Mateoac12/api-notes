module.exports = (error, request, response, next) => {
  console.log('pepito error')
  console.log(error.name)
  response.status(400)
}
