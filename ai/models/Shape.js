const mongoose = require( 'mongoose' )

module.exports = mongoose.model( 'Shape', new mongoose.Schema( {
	id   : {
		type    : Number,
		required: true,
		unique  : true
	},
	name : {
		type    : String,
		required: true,
		unique  : true
	},
	label: {
		type    : String,
		required: true
	}
} ) )
