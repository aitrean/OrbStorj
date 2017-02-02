'use strict'

const orbitdb = require('./lib/orbitHandler');
const menu = require('./lib/consoleMenu');

async function start() {
	await orbitdb.init('myApp');
	//let myDb = await orbitdb.mkDB(['begin', 'here'], 'kvstore');

	let action = await menu.openingMenu();
	switch (action.type) {
		case ("launchDefaultDatabaseConnection"):
			let myDb = await orbitdb.mkDB([action.data, 'type'], 'kvstore');
			break;
		default:
			break;
	}
};
start();
