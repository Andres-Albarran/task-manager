//Mongoose: facilita la tarea de conectarse a una base de datos de mongoDB
const mongoose = require('mongoose');

//Enlace a la base de datos guardada en la nube
const mongodb_URI = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

///Función que conecta la aplicación a la base de datos.
mongoose.connect(mongodb_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
    .then(db => console.log("base de datos conectada"))
    .catch(err => console.log(err));
