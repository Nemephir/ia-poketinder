module.exports = class CacheItem {

	name
	value
	date
	expiration

	constructor( name, value, duration ) {
		this.name       = name
		this.value      = value
		this.date       = new Date()
		this.expiration = this.date.getTime() + duration * 1000
	}

	isValid() {
		return this.expiration > new Date().getTime()
	}

	getValue() {
		return this.value
	}

}