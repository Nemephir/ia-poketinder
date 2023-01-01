module.exports.index = async (req, res) => {
	// let pokemon = await req.profile.getNextPokemon()
	res.send( await req.profile.getNextPokemon() )
}

module.exports.indexAction = async (req, res) => {
	await req.profile.vote( req.body.pokemon_id, req.body.status )
	res.send( await req.profile.getNextPokemon() )
}