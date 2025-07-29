import mongoose from 'mongoose'
const mySchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
     author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This links it to the User model
    required: true,
  },
    created:{
        type:Date,

        default:Date.now
    }
    })
    const Message= mongoose.model('Message',mySchema)
    export default Message