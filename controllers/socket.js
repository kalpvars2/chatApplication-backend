const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Chat = require('../models/chatsModel');

const buildDocKey = (messageObject) => {
	return [messageObject.sender, messageObject.receiver].sort().join(':');
};

module.exports = function (io) {
	io.on('connection', socket => {
		console.log(socket.id);
		socket.on('join', async ({email}) => {
			const user = await User.findOneAndUpdate({email: email}, {socketId: socket.id}, {new: true});
		});

		socket.on('submitMessage', async ({messageObject}) => {
			const docKey = buildDocKey(messageObject);
			const chat = await Chat.findOneAndUpdate({docKey: docKey}, {$push: {messages: messageObject}, receiverHasRead: false});
			const senderChats = await Chat.find({docKey: {"$regex" : '.*' + messageObject.sender + '.*'}});
			io.to(socket.id).emit('receiveUpdatedChats', {updatedChats : senderChats});
			const receiver = await User.findOne({email: messageObject.receiver});
			if(receiver.socketId !== ''){
				const receiverChats = await Chat.find({docKey: {"$regex" : '.*' + messageObject.receiver + '.*'}});
				io.to(receiver.socketId).emit('receiveUpdatedChats', {updatedChats : receiverChats});
			}
		});

		socket.on('messageRead', async ({docKey}) => {
			await Chat.findOneAndUpdate({docKey: docKey}, {receiverHasRead: true}, {new: true});
			const sender = await User.findOne({socketId: socket.id});
			const senderChats = await Chat.find({docKey: {'$regex': '.*' + sender.email + '.*'}});
			io.to(socket.id).emit('receiveUpdatedChats', {updatedChats: senderChats});
		});

		socket.on('newChat', async ({chatObject}) => {
			const newChatObject = chatObject;
			console.log(newChatObject);
		});

		socket.on('checkUserExists', async ({email}, callback) => {
			const user = await User.findOne({email: email});
			callback({result: user});
		});

		socket.on('checkChatExists', async ({docKey}, callback) => {
			const chat = await Chat.findOne({docKey: docKey});
			callback({result: chat});
		});

		socket.on('disconnects', async ({email}) => {
			const user = await User.findOneAndUpdate({email: email}, {socketId: ''}, {new: true});
			console.log('User has left.');
			socket.disconnect();
		});
	});
	return router;
};