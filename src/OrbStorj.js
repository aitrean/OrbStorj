'use strict';

const menu = require('./lib/consoleMenu');
const orbitdb = require('./lib/orbitHandler');
const dirty = require('dirty');
let db;
let dbRecord;
let ipfs;

const start = async function start() {
	try {
		dbRecord = dirty('./localkv.db');
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
			case ('createDatabaseConnection'):
				let newDatabaseInfo = await menu.getDatabaseInfo();
				dbRecord.set(newDatabaseInfo.name, {
					hash: newDatabaseInfo.hash
				});
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
