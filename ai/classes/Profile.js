const pokedex     = require( './../helper/pokedex' )
const Profile     = require( './../models/Profile' )
const ProfileVote = require( './../models/ProfileVote' )

module.exports = class ProfileController {

	id = 0

	async load( id ) {
		let entry = await Profile.findOne( { _id: id } )
		this.id   = entry._id.toString()
	}

	async getRemains( shuffle = false ) {
		let count   = await pokedex.count()
		let voted   = await this.getVotedPokemonIds()
		let remains = []

		for( let i = 1 ; i <= count ; i++ ) {
			if( ! voted.includes( i ) ) {
				remains.push( i )
			}
		}

		return shuffle
			? remains.sort( () => Math.random() - 0.5 )
			: remains
	}

	async getVotedPokemonIds() {
		return ( await ProfileVote.find( { profileId: this.id } ) )
			.map( i => i.pokemon_id )
	}

	async create() {
		let entry = await Profile.create( {} )
		this.id   = entry._id.toString()
	}

	async getNextPokemonId() {
		return ( await this.getRemains( true ) )[0]
	}

	async getNextPokemon() {
		let id = await this.getNextPokemonId()
		return await pokedex.getPokemon( id )
	}

	async vote( pokemonId, status ) {
		return await ProfileVote.create( {
			profile    : this.id,
			pokemon_id: pokemonId,
			status    : status
		} )
	}

	async update( data ) {
		return await Profile.updateOne(
			{ _id: this.id },
			data
		)
	}
}