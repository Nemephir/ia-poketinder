const axios = require( 'axios' )

const cache = {
	count   : undefined,
	pokemons: {}
}

const request = new axios.create( {
	baseURL: 'https://pokeapi.co/api/v2',
	headers: {
		'content-type': 'application/json'
	}
} )

module.exports.request = request

module.exports.count = async () => {
	if( cache.count === undefined ) {
		cache.count = ( await request.get( '/pokemon?limit=0' ) ).data.count
	}
	return cache.count
}

module.exports.getPokemon = async ( id ) => {
	if( cache.pokemons[id] === undefined ) {
		cache.pokemons[id] = ( await request.get( `/pokemon/${id}` ) ).data
	}
	return cache.pokemons[id]
}

module.exports.getTypes = async () => {
	return ( await request.get( '/type' ) ).data.results
}

module.exports.getType = async ( id ) => {
	return ( await request.get( `/type/${id}` ) ).data
}