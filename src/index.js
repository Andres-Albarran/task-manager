//Importar la lógica del servidor y la base de datos
const app = require('./server');
require('./database');

//Se define el puerto en el que se iniciará la aplicación
app.set('port', process.env.PORT || 3000)
//Se conecta la aplicación al puerto y se imprime "el servidor ha iniciado" una vez esta esté conectada.
app.listen(app.get('port'), ()=> {
  console.log("El servidor ha iniciado");
})
