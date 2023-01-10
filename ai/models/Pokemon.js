const mongoose = require( 'mongoose' )

module.exports = mongoose.model( 'Pokemon', new mongoose.Schema( {
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
	generation  : Number,
	types       : [ String ],
	specie      : {
		id   : Number,
		name : String,
		label: String
	},
	abilities   : [ String ],
	moves       : [
		{
			name : String,
			level: Number
		}
	],
	sprite      : {
		small: String,
		full : String
	},
	stats       : {
		hp             : Number,
		attack         : Number,
		defense        : Number,
		special_attack : Number,
		special_defense: Number,
		speed          : Number
	},
	weight      : Number,
	color       : String,
	shape       : String,
	evolved_from: String|null,
	elvolves_to : {
		id     : Number,
		trigger: String,
		details: {}
	}
} ) )
