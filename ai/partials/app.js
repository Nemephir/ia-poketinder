const express = require( 'express' )

const app = express()

app.use( express.json() )
app.use( express.urlencoded() )

require( './../middlewares/cors' )( app )
require( './../middlewares/secure' )( app )

app.use( '/', require( './../routes/_routes' ) )

const port = process.env.PORT || 3000
app.listen( port, () => {
	console.log( `Server listening on port ${port}` )
} )