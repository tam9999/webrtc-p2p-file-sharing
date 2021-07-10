const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	mail: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: Number,
		require: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('users', UserSchema)
