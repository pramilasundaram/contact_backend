const mongoose=require('mongoose');
const validator=require('validator')
const userSchema = new mongoose.Schema({
    
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw Error("not valid email")
            }
        }
    },
    phonenumber: {
        type: String,
        require: true,
        unique:true,
        minlength:10,
        maxlength:10,
    },
    gender: {
        type: String,
        require: true
    },
   image: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    dateCreated:Date,
    dateUpdated:Date
      });

  module.exports = mongoose.model('User', userSchema);
  