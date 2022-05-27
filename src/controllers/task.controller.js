const taskCtrl = {};
const task = require('../models/task');
const finished = require('../models/finished');
const user = require('../models/user');
const archivatedTasks = require('../models/archivated');
const handlebars = require('handlebars');
const mongoose = require('mongoose');


taskCtrl.addTask = async (req, res) => {
  const { user: { name, image} = {} } = req;
  res.render('./tareas/nueva-tarea', {name, image})
};

taskCtrl.newTask = async (req, res) => {
  const {title, description, usuariosACargo, deadline, assignDate} = req.body;
  const errors = [];
  if(typeof(req.file) == 'undefined') {
    errors.push({text: "Debes subir una imagen para la tarea."})
  }
  if(req.body.title == '') {
    errors.push({text: "Debes ponerle un nombre a esta tarea."})
  }
  if(errors.length > 0) {
    res.redirect("/tareas/nueva-tarea");
  }
  else {
  var image = req.file.filename;
  let usuario = await user.find().lean();
  let newTask = new task({
    img: image,
    title: title,
    description: description,
    usersIncharge: usuariosACargo,
    assignDate: assignDate,
    deadline: deadline
  });
  await newTask.save();
  console.log(newTask);
  req.flash('Success_msg', "Tarea agregada con exito.");
  res.redirect('/tareas')
}
}

taskCtrl.renderTasks = async (req, res) => {
  const { user: { name, image} = {} } = req;
  if (req.user.role == "admin") {
    const tasks = await task.find().lean();
    await res.render("tareas/todas-las-tareas", {tasks, name, image});
  }
  else {
  const tasks = await task.find({"usersIncharge" : {$regex : req.user.name, "$options": "i" }}).lean();
  await res.render("tareas/todas-las-tareas", {tasks, name, image});
}};

taskCtrl.editTask = async (req, res) => {
  const { user: { name, image } = {} } = req;
  const tasks = await task.findById(req.params.id).lean();
  if (req.user.role == "admin") {
  res.render("tareas/editar-tarea", {tasks, name, image, admin: true})
}
else {
  res.render("tareas/editar-tarea", {tasks, name, image, admin: false})
}
}

taskCtrl.updateTask = async (req, res) => {
  const { user: { name, image } = {} } = req;
  const {title, description, usersIncharge} = req.body;
  await task.findByIdAndUpdate(req.params.id, {title, description, usersIncharge});
  req.flash('Success_msg', "Tarea editada con exito.");
  res.redirect('/tareas')
}

taskCtrl.deleteTask = async (req, res) => {
  await task.findByIdAndDelete(req.params.id);
  req.flash('Success_msg', "Tarea eliminada.");
  res.redirect('/tareas')

}

taskCtrl.finishTask = async (req, res) => {
  mongoose.model('task').findOne({ _id: req.params.id }, function(err, result) {
      let swap = new (mongoose.model('finished'))(result.toJSON());
      result.remove()
      swap.save()
  })
  req.flash('Success_msg', "Tarea marcada como finalizada.");
res.redirect('/tareas/tareas-terminadas')}

taskCtrl.finish = async (req, res) => {
  const { user: { name, image } = {} } = req;
    if (req.user.role == "admin") {
      const finish = await finished.find().lean();
      res.render("tareas/tareas-terminadas", {finish, name, image})
    }
    else {
  const finish = await finished.find({"usersIncharge" : {$regex : req.user.name, "$options": "i" }}).lean();
  res.render("tareas/tareas-terminadas", {finish, name, image})
}
}

taskCtrl.devolver = async (req, res) => {
  mongoose.model('finished').findOne({ _id: req.params.id }, function(err, result) {
      let swap = new (mongoose.model('task'))(result.toJSON());
      result.remove()
      swap.save()
  })
  req.flash('Success_msg', "Tarea devuelta a las tareas en curso.");
res.redirect('/tareas')
}

taskCtrl.archivar = async (req, res) => {
  mongoose.model('finished').findOne({ _id: req.params.id }, function(err, result) {
      let swap = new (mongoose.model('archivated'))(result.toJSON());
      result.remove()
      swap.save()
  })
  req.flash('Success_msg', "Tarea archivada");
res.redirect('./tareas/tareas-archivadas')
}

taskCtrl.verTareasArchivadas = async (req, res) => {
  const { user: { name, image } = {} } = req;
  const archivados = await archivatedTasks.find({}).lean();
  res.render('./tareas/tareas-archivadas', {name, image, archivados})
};

taskCtrl.devolverFinalizadas = async (req, res) => {
  mongoose.model('archivated').findOne({ _id: req.params.id }, function(err, result) {
      let swap = new (mongoose.model('finished'))(result.toJSON());
      result.remove()
      swap.save()
  })
  req.flash('Success_msg', "Tarea devuelta a tareas en curso");
res.redirect('/tareas')
}

module.exports = taskCtrl;
