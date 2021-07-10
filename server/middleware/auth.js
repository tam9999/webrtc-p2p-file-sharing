const jwt = require('jsonwebtoken')

const User = require('../models/User')

const verifyToken = (req, res, next) => {
	const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1]

	if (!token)
		return res
			.status(401)
			.json({ success: false, message: 'Access token not found' })

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
		// req.userId = decoded.userId
		// next()
		//console.log(req.userId)
		req.userId = decoded.userId 
		User.findOne({
			_id: decoded.userId
		})
		.then(data=>{
			if(data){
				req.userId = decoded.userId
				req.data = data
				next()
			}else{
				res.json({ success: false, message: 'Not Permision' })
			}
		})
		.catch(err=>{
		})
	} catch (error) {
		console.log(error)
		return res.status(403).json({ success: false, message: 'Invalid token' })
	}
}

module.exports = verifyToken
