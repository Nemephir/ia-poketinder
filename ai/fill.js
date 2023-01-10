require( 'dotenv' ).config()
require( 'colors' )
const axios = require( 'axios' )

const pokedex = require( './helper/pokedex' )
const Pokemon = require( './models/Pokemon' )
const Type    = require( './models/Type' )
const Cache   = require( './classes/Cache' )

const caches = {
	types: new Cache( 600, async ( name ) => {
		console.log( `> TYPE: ${name}`.yellow )
		return ( await pokedex.request( `/type/${name}` ) ).data
	} )
}

run = async () => {
	await require( './partials/database' )

	const pokemons = ( await pokedex.request( '/pokemon?limit=2000' ) ).data.results
	for( const p of pokemons ) {
		const data             = ( await pokedex.request( `/pokemon/1` ) ).data
		const specie           = ( await pokedex.request( `/pokemon-species/${data.name}` ) ).data
		const evolutionChainId = specie.evolution_chain.url.split( '/' ).filter( v => v.trim().length > 0 ).pop()
		const evolution        = ( await pokedex.request( `/evolution-chain/${evolutionChainId}` ) ).data

		const pokemonLang = specie.names.find( v => v.language.name === 'fr' )
		const specieLang  = specie.genera.find( v => v.language.name === 'fr' )

		const pokemon = {
			id          : data.id,
			name        : data.name,
			label       : pokemonLang ? pokemonLang.name : data.name,
			sprite      : data.sprites.front_default,
			image       : data.sprites.other['official-artwork'].front_default,
			types       : data.types.map( v => v.type.name ),
			abilities   : data.abilities.map( v => v.ability.name ),
			stats       : {
				hp             : data.stats.find( v => v.stat.name === 'hp' ).base_stat,
				attack         : data.stats.find( v => v.stat.name === 'attack' ).base_stat,
				defense        : data.stats.find( v => v.stat.name === 'defense' ).base_stat,
				special_attack : data.stats.find( v => v.stat.name === 'special-attack' ).base_stat,
				special_defense: data.stats.find( v => v.stat.name === 'special-defense' ).base_stat,
				speed          : data.stats.find( v => v.stat.name === 'speed' ).base_stat,
				happiness      : specie.base_happiness
			},
			weight      : data.weight,
			specie      : specie.id,
			color       : specie.color.name,
			specie_name : specieLang ? specieLang.genus : specie.name,
			generation  : parseGeneration( specie.generation.name ),
			habitat     : specie.habitat ? specie.habitat.name : null,
			is_baby     : specie.is_baby,
			is_legendary: specie.is_legendary,
			is_mythical : specie.is_mythical,
			shape       : specie.shape.name,
			moves       : data.moves.map( v => {
				const filtered = v.version_group_details.filter( i => i.level_learned_at > 0 )
				return {
					name: v.move.name,
					level: filtered.length > 0 ? filtered.pop().level_learned_at : 0
				}
			} ),
			evolved_from: specie.evolves_from_species ? specie.evolves_from_species.name : null,
			evolutions  : parseEvolutions( data.name, evolution )
		}

		let one = await Pokemon.findOne( { name: pokemon.name } )
		if( one ) {
			one = Object.assign( one, pokemon )
			await one.save()
		}
		else {
			await Pokemon.create( pokemon )
		}

		console.log( pokemon )

		process.exit( 1 )
	}

	console.log( await getType( 'normal' ) )
	console.log( await getType( 'normal' ) )
	// console.log( await getType('normal') );

	// await fillTypes()
	// await fillMoves()
	// await fillPokemons()
}

run()

const parseGeneration = ( generation ) => {
	let gen = generation.split( '-' )[1]
	switch( gen ) {
		case 'i':
			return 1
		case 'ii':
			return 2
		case 'iii':
			return 3
		case 'iv':
			return 4
		case 'v':
			return 5
		case 'vi':
			return 6
		case 'vii':
			return 7
		case 'viii':
			return 8
		case 'ix':
			return 9
	}
}

const parseEvolutions = ( pokemonName, evolutionChain ) => {
	const chain = evolutionChain.chain ? evolutionChain.chain : evolutionChain
	if( chain.species.name === pokemonName ) {
		let results = []
		for( const evo of chain.evolves_to ) {
			results.push( {
				to        : evo.species.name,
				conditions: evo.evolution_details
			} )
		}
		return results.length > 0
			? results
			: null
	}
	else if( chain.evolves_to.length > 0 ) {
		return parseEvolutions( pokemonName, chain.evolves_to[0] )
	}
	else {
		return false
	}
}

const getType = async ( name ) => {
	return await caches.types.get( name )
}

// const fillTypes = async () => {
// 	console.log( `\n` )
// 	console.log( `  DOWNLOAD TYPES  `.bgYellow.white )
// 	const downloader = new TypeDownloader()
// 	await downloader.run()
// 	console.log( `--end`.yellow )
// }
//
// const fillMoves = async () => {
// 	console.log( `\n` )
// 	console.log( `  DOWNLOAD MOVES  `.bgYellow.white )
// 	const downloader = new MoveDownloader()
// 	await downloader.run()
// 	console.log( `--end`.yellow )
// }
//
// const fillPokemons = async () => {
// 	console.log( `\n` )
// 	console.log( `  DOWNLOAD POKEMONS  `.bgYellow.white )
//
// 	const pokemons = ( await pokedex.request.get( '/pokemon?limit=2000' ) ).data.results
// 	console.log( pokemons )
//
// 	console.log( `--end`.yellow )
// }

