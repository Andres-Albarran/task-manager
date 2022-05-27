const userCtrl = {};
const user = require('../models/user');
const passport = require('passport');

userCtrl.renderSignUpForm = (req, res) => {
  const { user: { name, image } = {} } = req;
  res.render('usuarios/signup', {name, image})
};

userCtrl.signUp = async (req, res) => {
  const errors = [];
  const {name, email, password, password2} = req.body;
  if(password != password2) {
    errors.push({text: "Las claves no coinciden"})
  }
  if(password.length < 4) {
    errors.push({text: "Las claves deben tener al menos cuatro caracteres."})
  }
  if (typeof(req.file) == 'undefined') {
    errors.push({text: "Debes subir una imagen de perfil"});
  }
  if (req.body.name == '') {
    errors.push({text: "Debes introducir tu nombre."})
  }
  if (req.body.email == '') {
    errors.push({text: "Debes introducir un email."})
  }
  if (req.body.password == '') {
    errors.push({text: "Introduce una clave."})
  }
  if (req.body.password2 == '') {
    errors.push({text: "Por favor, confirma la clave."})
  }
  if(errors.length > 0) {
    res.render("usuarios/signup", {
      errors,
      name,
      email
    })
  }
  else {
    const emailUser = await user.findOne({email: email});
    if(emailUser) {
      req.flash('error_msg', 'Ese correo ya existe en el sistema.');
      res.redirect("/usuarios/signup")
    }
    else {
      const image = req.file.filename;
      const newUser = new user ({image, name, email, password});
      newUser.password = await newUser.encriptarClave(password);
      await newUser.save();
      req.flash('Success_msg', 'Te has registrado con exito')
      res.redirect('/tareas')
    }
  }
};

userCtrl.renderSignInForm = (req, res) => {
  if (req.user) {
    req.flash('error_msg', 'Ya iniciaste sesion.');
    res.redirect("/")
  }
  res.render('usuarios/signin');
};

userCtrl.signIn = passport.authenticate('local', {
  failureRedirect: '/usuarios/signin',
  successRedirect: '/',
  failureFlash: true,
});

userCtrl.logout = (req, res) => {
  req.logout();
  req.flash("Success_msg", "Sesion cerrada con exito.");
  res.redirect('/');
}

userCtrl.deleteUser = async (req, res) => {
  if(req.params.id == "6255be3601aabfffcfe5e7bc")
  {  req.flash('error_msg', "No puedes eliminar ese usuario");
    res.redirect('/usuarios') }
    else {
  await user.findByIdAndDelete(req.params.id);
  req.flash('Success_msg', "Usuario eliminado");
  res.redirect('/usuarios')
}
}

module.exports = userCtrl;
