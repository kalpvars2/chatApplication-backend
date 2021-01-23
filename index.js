const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const Chat = require('./models/chatsModel');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
	cors: {
		origin: '*'
	}
});

connectDB();
app.use(cors());
app.use(express.json());


app.use(require('./controllers/socket')(io));
app.use('/register', require('./routes/api/register'));
app.use('/login', require('./routes/api/login'));
app.use('/dashboard', require('./routes/api/dashboard'));

app.get('/', (req, res) => {res.json("Server up and running.")});
server.listen(process.env.PORT, () => console.log(`Server is up on port ${process.env.PORT}.`));