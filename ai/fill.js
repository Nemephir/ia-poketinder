require( 'dotenv' ).config()
require( 'colors' )
const axios = require( 'axios' )

const pokedex = require( './helper/pokedex' )
const Color   = require( './models/Color' )
const Move    = require( './models/Move' )
const Pokemon = require( './models/Pokemon' )
const Shape   = require( './models/Shape' )
const Type    = require( './models/Type' )
const Cache   = require( './classes/Cache' )

const generations = [ '', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix' ]

const caches = {
	types: new Cache( 600, async ( name ) => {
		console.log( `> TYPE: ${name}`.yellow )
		return ( await pokedex.request( `/type/${name}` ) ).data
	} )
}

run = async () => {
	await require( './partials/database' )

	// await downloadPokemons()
	// await downloadTypes()
	// await downloadColors()
	// await downloadShapes()
	await downloadMoves()

	// TODO : moves

	console.log( '-- fin' )
	// console.log( await getType('normal') );

	// await fillTypes()
	// await fillMoves()
	// await fillPokemons()
}

run()

const downloadPokemons = async () => {
	const count    = ( await pokedex.request( '/pokemon' ) ).data.count
	const response = ( await pokedex.request( `/pokemon?limit=${count}` ) ).data.results
	for( const p of response ) {
		await downloadPokemon( p )
	}
}

const downloadPokemon = async ( p ) => {
	const data = ( await pokedex.request( `/pokemon/${p.name}` ) ).data
	try {
		const id               = p.url.split( '/' ).slice( -2, -1 )[0]
		const specie           = ( await pokedex.request( `/pokemon-species/${id}` ) ).data
		const evolutionChainId = specie.evolution_chain.url.split( '/' ).filter( v => v.trim().length > 0 ).pop()
		const evolution        = ( await pokedex.request( `/evolution-chain/${evolutionChainId}` ) ).data

		const pokemonLang = specie.names.find( v => v.language.name === 'fr' )
		const specieLang  = specie.genera.find( v => v.language.name === 'fr' )

		const pokemon = {
			id          : data.id,
			name        : data.name,
			label       : pokemonLang ? pokemonLang.name : data.name,
			sprite      : {
				full : data.sprites.other['official-artwork'].front_default,
				small: data.sprites.front_default
			},
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
			specie      : {
				id   : specie.id,
				name : specie.name,
				label: specieLang ? specieLang.genus : specie.name
			},
			color       : specie.color.name,
			specie_name : specieLang ? specieLang.genus : specie.name,
			generation  : parseGeneration( specie.generation.name ),
			habitat     : specie.habitat ? specie.habitat.name : null,
			is_baby     : specie.is_baby,
			is_legendary: specie.is_legendary,
			is_mythical : specie.is_mythical,
			shape       : specie.shape ? specie.shape.name : null,
			moves       : data.moves.map( v => {
				const filtered = v.version_group_details.filter( i => i.level_learned_at > 0 )
				return {
					name : v.move.name,
					level: filtered.length > 0 ? filtered.pop().level_learned_at : 0
				}
			} ),
			evolved_from: specie.evolves_from_species ? specie.evolves_from_species.name : null,
			evolutions  : parseEvolutions( data.name, evolution )
		}

		await createOrUpdate( Pokemon, pokemon )

		console.log( pokemon )
	}
	catch( e ) {
		console.log( `  ERROR : ${data.name}  `.bgRed.white )
		console.log( e )
	}
}

const downloadTypes = async () => {
	const count    = ( await pokedex.request( '/type' ) ).data.count
	const response = ( await pokedex.request( `/type?limit=${count}` ) ).data.results
	for( const t of response ) {
		await downloadType( t )
	}
}

const downloadType = async ( t ) => {
	const data = ( await pokedex.request( `/type/${t.name}` ) ).data
	try {
		const type = {
			id   : data.id,
			name : data.name,
			label: data.names.find( v => v.language.name === 'fr' ).name,
		}

		await createOrUpdate( Type, type )
	}
	catch( e ) {
		console.log( `  ERROR : ${data.name}  `.bgRed.white )
		console.log( e )
	}
}

const downloadColors = async () => {
	const count   = ( await pokedex.request( '/pokemon-color' ) ).data.count
	const response = ( await pokedex.request( `/pokemon-color?limit=${count}` ) ).data.results
	for( const c of response ) {
		await downloadColor( c )
	}
}

const downloadColor = async ( c ) => {
	const data = ( await pokedex.request( `/pokemon-color/${c.name}` ) ).data
	try {
		const color = {
			id   : data.id,
			name : data.name,
			label: data.names.find( v => v.language.name === 'fr' ).name,
		}

		await createOrUpdate( Color, color )
	}
	catch( e ) {
		console.log( `  ERROR : ${data.name}  `.bgRed.white )
		console.log( e )
	}
}

const downloadShapes = async () => {
	const count   = ( await pokedex.request( '/pokemon-shape' ) ).data.count
	const response = ( await pokedex.request( `/pokemon-shape?limit=${count}` ) ).data.results
	for( const s of response ) {
		await downloadShape( s )
	}
}

const downloadShape = async ( s ) => {
	const data = ( await pokedex.request( `/pokemon-shape/${s.name}` ) ).data
	try {
		const shape = {
			id   : data.id,
			name : data.name,
			label: data.names.find( v => v.language.name === 'fr' ).name,
		}

		await createOrUpdate( Shape, shape )
	}
	catch( e ) {
		console.log( `  ERROR : ${data.name}  `.bgRed.white )
		console.log( e )
	}
}

const downloadMoves = async () => {
const count   = ( await pokedex.request( '/move' ) ).data.count
	const response = ( await pokedex.request( `/move?limit=${count}` ) ).data.results
	for( const m of response ) {
		await downloadMove( m )
	}
}

const downloadMove = async ( m ) => {
	const data = ( await pokedex.request( `/move/${m.name}` ) ).data
	try {
		const move = {
			id         : data.id,
			name       : data.name,
			label      : data.names.find( v => v.language.name === 'fr' ).name,
			power      : data.power,
			accuracy   : data.accuracy,
			pp         : data.pp,
			priority   : data.priority,
			target     : data.target.name,
			damage_class: data.damage_class.name,
			// effects    : data.effect_entries.find( v => v.language.name === 'fr' ).effect,
			type       : data.type.name
		}

		await createOrUpdate( Move, move )
	}
	catch( e ) {
		console.log( `  ERROR : ${data.name}  `.bgRed.white )
		console.log( e )
	}
}


const createOrUpdate = async ( model, data ) => {
	let one = await model.findOne( { name: data.name })
	if( one ) {
		one = Object.assign( one, data )
		await one.save()
	}
	else {
		await model.create( data )
	}
}

const parseGeneration = ( generation ) => {
	return generations.indexOf( generation.split( '-' )[1] )
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

