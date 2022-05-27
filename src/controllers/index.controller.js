const indexCtrl = {};
const user = require('../models/user');

indexCtrl.renderIndex = (req, res) => {
  const { user: { name, image } = {} } = req;
  res.render('index', {name, image});
}

indexCtrl.renderAbout = (req, res) => {
  const { user: { name, image } = {} } = req;
  res.render('about', {name, image})
}

indexCtrl.renderUsuarios = async (req, res) => {
  const { user: { name, image } = {} } = req;
  const usuarios = await user.find().lean();
  res.render("usuarios", {usuarios, name, image});
}

module.exports = indexCtrl;
