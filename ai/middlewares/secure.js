const Profile = require( './../classes/Profile' )

module.exports = (app) => {
	app.use( async (req, res, next) => {
		let profileId = req.headers.profile
		req.profile = new Profile()
		await req.profile.load( profileId )
		next()
	} )
}