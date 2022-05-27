const mongoose = require('mongoose');
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const taskSchema = new mongoose.Schema({
  img: {
    type: String,
    default: 'placeholder.jpg'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  usersIncharge: {
    type: String
  },
  assignDate: {
    type: Date
  },
  deadline: {
    type: Date
  },
  slug: { type: String, slug: "title" },
slug2: { type: String, slug: "description" },
slug3: { type: String, slug: "usersIncharge" },
slug4: { type: Date, slug: "deadline" },
slug5: { type: Date, slug: "assignDate" }
  }, {
  timestamps: true
});

module.exports = mongoose.model('task', taskSchema, 'tasks')
