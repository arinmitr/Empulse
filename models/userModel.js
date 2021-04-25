const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'A user should have an email'],
      unique: [true, 'Email already in use'],
      lowercase: true,
      validate: [validator.isEmail, 'Provide a valid mail'],
    },
    emp_id: {
      type: Number,
      required: [true, 'Emp Id is required'],
      unique: true,
    },
    designation: {
      type: String,
      enum: [
        'Analyst',
        'Sr. Analyst',
        'Associate Consultant',
        'Consultant',
        'Senior Consultant',
        'Manager',
        'Sr. Manager',
        'Program Manager',
      ],
      required: [true, 'Designation is required'],
    },
    supervisor: {
      type: String,
      required: [true, 'Supervisor is required'],
    },
    location: String,
    account: String,
    role: {
      type: String,
      default: 'employee',
      enum: ['employee', 'supervisor', 'admin'],
    },
    alias: {
      type: String,
      minlength: [8, 'Minimum 8 chars required'],
      required: [true, 'Alias is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password needed'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Password needed'],
      minlength: 8,
      validate: {
        validator: function (el) {
          return el === this.password
        },
        message: 'Password Mismatch',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

userSchema.virtual('shifts', {
  ref: 'Shifts',
  localField: '_id',
  foreignField: 'user',
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

const Users = mongoose.model('Users', userSchema)

module.exports = Users
