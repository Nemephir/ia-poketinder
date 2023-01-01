const mongoose = require( 'mongoose' )
const Profile  = require( './Profile' )

module.exports = mongoose.model( 'Profile_Vote', new mongoose.Schema( {
	profile: {
		type    : mongoose.Schema.Types.ObjectId,
		ref     : Profile,
		required: true
	},
	pokemon_id: {
		type    : Number,
		required: true
	},
	status : {
		type    : Number,
		required: true
	}
} ) )
