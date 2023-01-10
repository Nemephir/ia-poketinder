const mongoose = require( 'mongoose' )

const connect = () => {
	return new Promise( ( resolve, reject ) => {
		mongoose.set( 'strictQuery', false )

		mongoose.connect( process.env.DB_HOST, {
			auth: {
				authSource: 'admin'
			},
			user: process.env.DB_USER,
			pass: process.env.DB_PSWD,
			useNewUrlParser: true,
			useUnifiedTopology: true
		} )

		mongoose.connection.on( 'error', (error) => {
			console.error.bind( console, 'connection error:' )
			throw error
		} )
		mongoose.connection.once( 'open', function() {
			console.log( 'Connected to MongoDB' )
			resolve(true)
		} )
	})
}

module.exports = connect()
