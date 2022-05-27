const { Router } = require('express');
const router = Router();
const {renderSignUpForm, signUp, renderSignInForm, signIn, logout, deleteUser} = require("../controllers/users.controller")
const multer = require('multer');
var path = require('path');
const user = require('../models/user');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const { isAuthenticated, authRole} = require('../helpers/auth');
//Definir base de datos donde se guardara la imagen

const storage = multer.diskStorage({
  //Destino de las imagenes
  destination: function (request, file, callback) {
    callback(null, process.cwd()+"/src/public/uploads");
  },

  //cambiar nombre a la imagen antes de guardarla en la base de datos
  filename: function (request, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({ storage: storage, limits: {fileSize: 1000000}});

router.get('/usuarios/signup', isAuthenticated, authRole, renderSignUpForm);

router.post('/usuarios/signup', upload.single('image'), signUp);


router.get('/usuarios/signin', renderSignInForm)

router.post('/usuarios/signin', signIn);

router.get('/usuarios/logout', logout);

router.delete('/usuarios/delete/:id', authRole, deleteUser)

module.exports = router;
