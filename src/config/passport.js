const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const usuario = require('../models/user');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  const user = await usuario.findOne({email});
  if (!user) {
    return done(null, false, {
      message: "Usuario inexistente."
    });
  } else {
    const match = await user.compararClaves(password);
    if (match) {
      return done(null, user);
    } else {
      return done(null, false, {message: "Clave incorrecta"});
    }
  }
}));

passport.serializeUser((usuario, done) => {
  done(null, usuario.id)
});

passport.deserializeUser((id, done) => {
  usuario.findById(id, (err, usuario) => {
    done(err, usuario);
  });
});
