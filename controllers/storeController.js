exports.myMiddleware = (req, res, next) => {
  req.name = 'Aurimas'
  next()
}
exports.homePage = (req, res) => {
  res.render('index')
}
