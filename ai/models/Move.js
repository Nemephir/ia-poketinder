const mongoose = require( 'mongoose' )

module.exports = mongoose.model( 'Move', new mongoose.Schema( {
	id          : {
		type    : Number,
		required: true,
		unique  : true
	},
	name        : {
		type    : String,
		required: true,
		unique  : true
	},
	label       : {
		type    : String,
		required: true
	},
	// effects     : [ {} ],
	accuracy    : Number,
	power       : Number,
	pp          : Number,
	stat_changes: [ {} ],
	type        : String
} ) )
