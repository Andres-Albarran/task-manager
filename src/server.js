const express = require('express');
const exphbs = require('express-handlebars')
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const user = require('./models/user');
const bcrypt = require('bcryptjs');

//Inicializaciones
const app = express();
require('./config/passport.js');


// async function insertAdmin () {
//   const newUser = new user ({image: "admin_image.jpg", name: "admin", password: "123456", role: admin, number: "0424-6493638"});
//   newUser.password = await newUser.encrypt(newUser.password);
//   await newUser.save();
// }
// insertAdmin()
//Configuracion


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
  }));

  app.set('view engine', 'hbs')

//Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.json());

//Variables globales
app.use((req, res, next) => {
  res.locals.Success_msg = req.flash("Success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});


//Rutas
app.use(require('./routes/index.routes'));
app.use(require('./routes/task.routes'));
app.use(require('./routes/users.routes'));


//Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
