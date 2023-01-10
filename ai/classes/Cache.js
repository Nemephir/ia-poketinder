const CacheItem = require('./CacheItem');

module.exports = class Cache {

	items = {}
	itemsDuration
	defaultItemCallable

	constructor( itemsDuration = 600, defaultItemCallable = null ) {
		this.itemsDuration = itemsDuration
		this.defaultItemCallable = defaultItemCallable
	}

	async get( name ) {
		let item = this.items[ name ]

		if( ! item || ! item.isValid() ) {
			this.items[name] = new CacheItem( name, await this.defaultItemCallable( name ), 600 )
		}

		return this.items[name].getValue()
	}
}