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
const main = async function (asd, asw) {
	await start();

	const testFile = async function testFile() {
		try {
			let data = await fsAsync.readFile('as1.pdf');
			await db.put('testPDF1', data);
			console.log(data);
			let file = db.get('testPDF');
			let c = new Buffer(file.data);
			console.log(c);

			await fsAsync.writeFile('success.pdf', c);
		} catch (e) {
			console.log(e);
		}
	};

	testFile();
};

main();
