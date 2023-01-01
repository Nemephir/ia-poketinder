const express = require( 'express' )

const testController  = require( './../controllers/testController' )
const matchController = require( './../controllers/matchController' )

const router  = express.Router()

router.get( '/test', testController.index )

router.get( '/match', matchController.index )
router.post( '/match', matchController.indexAction )

module.exports = router