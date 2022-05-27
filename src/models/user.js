const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new Schema({
  image: {
    type: String,
    default: 'placeholder.jpg',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "Employee"
  }
},
{
  timestamps: true
});

//Cifrar la clave en la base de datos
userSchema.methods.encriptarClave = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

//Comparar la clave introducida por el usuario con la registrada en la base de datos
userSchema.methods.compararClaves = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = model('user', userSchema)
