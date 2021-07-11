require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')

const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io")(process.env.PORT || 3000);
const io = socket(server, {
    cors: {
        origin: `https://webrtc-file-sharing.herokuapp.com/`,
        methods: ["GET", "POST"],
        credentials: true,
        rejectUnauthorized: false
    }
});

const connectDB = async () => {
	try {
		await mongoose.connect(
			`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@webrtc-p2p.co4j8.mongodb.net/webrtc-p2p?retryWrites=true&w=majority
			`,{
				useCreateIndex: true,
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false
			}
		)
		console.log('MongoDB connected')
	} catch (error) {
		console.log(error.message)
		process.exit(1)
	}
}

connectDB()

app.use(express.json())
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
//app.get('/', (req,res) => res.send("hello"))

const users = {};
const socketToRoom = {};

io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 2) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
            socket.broadcast.emit('user left', socket.id);
        }
    });

});

const PORT = process.env.PORT || 8000
server.listen(PORT, () => console.log(`Server started on port ${PORT} and app`))
//server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));     