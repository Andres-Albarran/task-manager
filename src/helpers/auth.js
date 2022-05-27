const helpers = {};
const handlebars = require('handlebars');
function isAuthenticated (req, res, next) {
  if(req.user == null) {
    res.status(403)
    return res.send('Necesitas iniciar sesion')
  }
  next()
}

function authRole (req, res, next) {
    if (req.user.role != 'admin') {
      res.status(403);
      req.flash('error_msg', "No autorizado")
      res.redirect('/')
    }
    else{
    next()
  }
}

module.exports = {isAuthenticated, authRole, }
