'use strict';

const menu = require('./lib/consoleMenu');
const orbitdb = require('./lib/orbitHandler');
let db;
let ipfs;

const start = async function start() {
	try {
		let action = await menu.openingMenu();
		switch (action.type) {
			case ('launchDefaultDatabaseConnection'):
				ipfs = await orbitdb.init('myApp');
				db = await orbitdb.mkDB([action.data, 'type'], 'kvstore');
				break;
			case ('launchDatabaseConnection'):
				ipfs = await orbitdb.init(action.data);
				db = await orbitdb.mkDB([action.data, 'type'], 'kvstore');
				break;
			default:
				break;
		}
	} catch (err) {
		console.log(err);
	}
};

const main = async function() {
	await start();
};

main();

