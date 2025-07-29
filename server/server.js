import express from "express"
import Message from '../server/models/message.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import bcrypt from 'bcrypt'
import User from '../server/models/user.js'
import jwt from 'jsonwebtoken'
import authMiddleware from "./middlewares/authMiddleware.js"
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
const port = 3000
//handling get an post requests

//handlind signup route
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = await req.body;
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ username: username, password: hashedPassword })
        res.status(200).json(user.username)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//handling login route
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = await req.body
        const user = await User.findOne({ username: username })
        if (!user) {
            res.status(401).json({ error: 'invalid userrname or password' })
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            res.status(401).json({ error: 'invalid username or password' })
        }
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
)
app.get('/api/messages',authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find({author:req.user.id}).populate('author', 'username').sort({ created: -1 })
        res.status(200).json(messages)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})



app.post('/api/messages',authMiddleware, async (req, res) => {
    try {
         const newMessage = new Message({
            text: req.body.text,      // Get text from the request body
            name: req.body.name,      // Get name from the request body
            author: req.user.id       // Get author ID from the middleware
        });
        const savedMessage = await newMessage.save();
        res.status(200).json(newMessage)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})
app.delete('/api/messages/:id', authMiddleware, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // --- CHANGE: Add this security check ---
        // Check if the logged-in user is the author of the message
        if (message.author.toString() !== req.user.id) {
            return res.status(403).json({ error: 'User not authorized' });
        }
        // --------------------------------------

        // If the check passes, delete the message
        await Message.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//connecting server the mongoDB Database
mongoose.connect(process.env.uri).then(() => {
    console.log('connected to mongodb')
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}).catch((err) => {
    console.log(`error connecting to mongodb ${err}`)
    console.log(err)
})

