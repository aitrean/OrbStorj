'use strict';

const menu = require('./lib/consoleMenu');
const orbitdb = require('./lib/orbitHandler');
const fsAsync = require('./lib/fileHandler');
let db;
let ipfs;

const start = async function start() {
	ipfs = await orbitdb.init('myApp');
	let action = await menu.openingMenu();
	switch (action.type) {
		case ('launchDefaultDatabaseConnection'):
			db = await orbitdb.mkDB([action.data, 'type'], 'kvstore');
			break;
		default:
			break;
	}
};
const main = async function () {
	await start();
};

main();
