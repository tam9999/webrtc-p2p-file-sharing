const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth')

const User = require('../models/User')

// const checkRole = (req, res, next) => {
// 	const role = req.data.role
// 	if(role >= 3){
// 		next()
// 	}else{
// 		res.json({ success: false, message: 'Not Permision' })
// 	}
// }

// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get('/', verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.userId).select('-password')
		if (!user)
			return res.status(400).json({ success: false, message: 'User not found' })
		res.json({ success: true, user })
		//console.log(user.role)
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', async (req, res) => {
	const { mail, username, password, role } = req.body

	// Simple validation
	if (!mail || !username || !password)
		return res
			.status(400)
			.json({ success: false, message: 'Missing username and/or password' })

	try {
		// Check for existing user
		const user = await User.findOne({ username })

		if (user){	
			if(mail)
				return res
					.status(400)
					.json({ success: false, message: 'Username or mail already taken' })
		}
		// All good
		const hashedPassword = await argon2.hash(password)
		const newUser = new User({ mail, username, password: hashedPassword, role })
		await newUser.save()

		// Return token
		const accessToken = jwt.sign(
			{ userId: newUser._id },
			process.env.ACCESS_TOKEN_SECRET
		)

		res.json({
			success: true,
			message: 'User created successfully',
			accessToken
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/auth/create
// @desc Create user
// @access private
router.post('/create', verifyToken, checkRole, async (req, res) => {
	const { mail, username, password, role } = req.body

	// Simple validation
	if (!mail || !username || !password)
		return res
			.status(400)
			.json({ success: false, message: 'Missing username and/or password' })

	try {
		// Check for existing user
		const user = await User.findOne({ username })

		if (user){	
			if(mail)
				return res
					.status(400)
					.json({ success: false, message: 'Username or mail already taken' })
		}
		// All good
		const hashedPassword = await argon2.hash(password)
		const newUser = new User({ mail, username, password: hashedPassword, role })
		await newUser.save()

		// Return token
		const accessToken = jwt.sign(
			{ userId: newUser._id },
			process.env.ACCESS_TOKEN_SECRET
		)

		res.json({
			success: true,
			message: 'User created successfully',
			newUser,
			accessToken
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post('/login', async (req, res) => {
	const { username, password } = req.body

	// Simple validation
	if (!username || !password)
		return res
			.status(400)
			.json({ success: false, message: 'Missing username and/or password' })

	try {
		// Check for existing user
		const user = await User.findOne({ username })
		if (!user)
			return res
				.status(400)
				.json({ success: false, message: 'Incorrect username or password' })

		// Username found
		const passwordValid = await argon2.verify(user.password, password)
		if (!passwordValid)
			return res
				.status(400)
				.json({ success: false, message: 'Incorrect username or password' })

		// All good
		// Return token
		const accessToken = jwt.sign(
			{userId: user._id },
			process.env.ACCESS_TOKEN_SECRET
		)

		res.json({
			success: true,
			message: 'User logged in successfully',
			accessToken
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route GET api/auth/profile
// @desc Get profile user
// @access Private
router.get('/profile', verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.userId)
		res.json({ success: true, user })
		//console.log(user.role)
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route PUT api/auth/update/:id
// @desc Update user
// @access Private
router.put('/update/:id', verifyToken, async (req, res) => {
	const { mail, username, password } = req.body

	// Simple validation
	if (!mail || !username|| !password)
		return res
			.status(400)
			.json({ success: false, message: 'Empty!' })

	try {
		// Check for existing user
		const user = await User.findOne({ username })

		if (user){	
			if(mail)
				return res
					.status(400)
					.json({ success: false, message: 'Username or mail already taken' })
		}
		const hashedPassword = await argon2.hash(password)
		let updatedProfile = {
			mail,
			username,
			password: hashedPassword
		}

		const postUpdateCondition = { _id: req.params.id }
		//console.log(req.userId)
		updatedProfile = await User.findOneAndUpdate(
			postUpdateCondition,
			updatedProfile,
			{ new: true }
		)

		// User not authorised to update post or post not found
		if (!updatedProfile)
			return res.status(401).json({
				success: false,
				message: 'User not found or user not authorised'
			})

		res.json({
			success: true,
			message: 'Excellent progress!',
			///********************* */
			post: updatedProfile
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route GET api/auth/users
// @desc Get users for admin
// @access Private
router.get('/users', verifyToken, checkRole, async (req, res) => {
	try {
		const users = await User.find()
		res.json({ success: true, users })
		//console.log(req.data.username)
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})


// @route PUT api/auth/:id
// @desc Update user for admin
// @access Private

router.put('/:id', verifyToken, checkRole, async (req, res) => {
	const { mail, username, password, role } = req.body
	// Simple validation
	if (!mail || !username || !password|| !role)
		return res
			.status(400)
			.json({ success: false, message: 'Empty!!!' })
	try {
		// Check for existing user
		const user = await User.findOne({ username })

		if (user){	
			if(mail)
				return res
					.status(400)
					.json({ success: false, message: 'Username or mail already taken' })
		}
		const hashedPassword = await argon2.hash(password)
		let updatedUser = {
			mail,
			username,
			password: hashedPassword,
			role
		}
		const userUpdateCondition = { _id: req.params.id }
		updatedUser = await User.findOneAndUpdate(
			userUpdateCondition,
			updatedUser,
			{ new: true }
		)
		// User not authorised to update post or post not found
		if (!updatedUser)
			return res.status(401).json({
				success: false,
				message: 'User not found or user not authorised'
			})
		res.json({
			success: true,
			message: 'Excellent progress!',
			//post ***********************************************************//
			post: updatedUser
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route DELETE api/auth/:id
// @desc Delete user for admin
// @access Private

router.delete('/:id', verifyToken, checkRole, async (req, res) => {
	try {
		const postDeleteCondition = { _id: req.params.id }
		const deletedUser = await User.findOneAndDelete(postDeleteCondition)

		// User not authorised or post not found
		if (!deletedUser)
			return res.status(401).json({
				success: false,
				message: 'User not found or user not authorised'
			})

		res.json({ success: true, post: deletedUser })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})


module.exports = router
