const { Router } = require('express');
const router = Router();
const multer = require('multer');
var path = require('path');
const {isAuthenticated, authRole} = require('../helpers/auth');

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

const {
  addTask,
  newTask,
  renderTasks,
  editTask,
  updateTask,
  deleteTask,
  finishTask,
  finish,
  devolver,
  archivar,
  verTareasArchivadas,
  devolverFinalizadas
} = require('../controllers/task.controller');

//Nueva tarea.
router.get('/tareas/nueva-tarea', isAuthenticated, authRole, addTask);
router.post('/tareas/crear',  upload.single('image'), newTask);

//Ver todas las tareas
router.get('/tareas', isAuthenticated, renderTasks);

//Editar tareas
router.get('/tareas/editar/:id', isAuthenticated, editTask);
router.put('/tareas/editar/:id', updateTask);

//Eliminar tareas
router.delete('/tareas/delete/:id', authRole, deleteTask)


//Finalizar y archivar tareas
router.post('/tareas/terminar/:id', finishTask)

router.get('/tareas/tareas-terminadas', isAuthenticated, finish);
router.post('/tareas/tareas-terminadas/:id', devolver);

router.post('/tareas/archivar/:id', authRole, archivar)
router.get('/tareas/tareas-archivadas', isAuthenticated, authRole, verTareasArchivadas);
router.post('/tareas/tareas-archivadas/:id', devolverFinalizadas)

module.exports = router;
