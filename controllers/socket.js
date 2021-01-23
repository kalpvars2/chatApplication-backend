const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Chat = require('../models/chatsModel');

const buildDocKey = (messageObject) => {
	return [messageObject.sender, messageObject.receiver].sort().join(':');
};

module.exports = function (io) {
	io.on('connection', socket => {
		socket.on('join', async ({email}) => {
			const user = await User.findOneAndUpdate({email: email}, {socketId: socket.id}, {new: true});
		});

		socket.on('submitMessage', async ({chatObject}) => {
			const chat = await Chat.findOne({docKey: chatObject.docKey});
			if(chat === null){
				const newChatObject = new Chat(chatObject);
				await newChatObject.save();
			} else {
				await Chat.updateOne({docKey: chatObject.docKey}, {$push: {messages: chatObject.messages[0]}, receiverHasRead: false}, {new: true});
			}
			const lastMessage = chatObject.messages[0];
			const senderChats = await Chat.find({docKey: {"$regex" : '.*' + lastMessage.sender + '.*'}});
			io.to(socket.id).emit('receiveUpdatedChats', {updatedChats : senderChats});
			const receiver = await User.findOne({email: lastMessage.receiver});
			if(receiver.socketId !== ''){
				const receiverChats = await Chat.find({docKey: {"$regex" : '.*' + lastMessage.receiver + '.*'}});
				io.to(receiver.socketId).emit('receiveUpdatedChats', {updatedChats : receiverChats});
			}
		});

		socket.on('messageRead', async ({docKey}) => {
			await Chat.findOneAndUpdate({docKey: docKey}, {receiverHasRead: true}, {new: true});
			const sender = await User.findOne({socketId: socket.id});
			const senderChats = await Chat.find({docKey: {'$regex': '.*' + sender.email + '.*'}});
			io.to(socket.id).emit('receiveUpdatedChats', {updatedChats: senderChats});
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