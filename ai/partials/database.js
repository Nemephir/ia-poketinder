const mongoose = require( 'mongoose' )

mongoose.set( 'strictQuery', false )

mongoose.connect( process.env.DB_HOST, {
	auth: {
		authSource: 'admin'
	},
	user: process.env.DB_USER,
	pass: process.env.DB_PSWD
} )

mongoose.connection.on( 'error', console.error.bind( console, 'connection error:' ) )
mongoose.connection.once( 'open', function() {
	console.log( 'Connected to MongoDB' )
} )