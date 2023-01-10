const mongoose = require( 'mongoose' )

module.exports = mongoose.model( 'Pokemon', new mongoose.Schema( {
	id        : {
		type    : Number,
		required: true,
		unique  : true
	},
	name      : {
		type    : String,
		required: true,
		unique  : true
	},
	label     : {
		type    : String,
		required: true
	},
	generation: Number,
	types     : [ String ],
	specie    : {
		id   : Number,
		label: String
	},
	abilities : [ String ],
	moves     : [
		{
			name : String,
			level: Number
		}
	],
	sprite    : {
		small: String,
		full : String
	},
	stats     : {
		hp             : Number,
		attack         : Number,
		defense        : Number,
		special_attack : Number,
		special_defense: Number,
		speed          : Number
	},
	weight    : Number,
	color: {
		name: String,
		label: String
	},
	shape: {
		name: String,
		label: String
	},
	evolved_from: Number,
	elvolves_to: {
		id: Number,
		trigger: String,
		details: {}
	}
} ) )
