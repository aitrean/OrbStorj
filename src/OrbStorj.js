'use strict';

const menu = require('./lib/consoleMenu');
const orbitdb = require('./lib/orbitHandler');
const fs = require('fs');

async function start() {
	await orbitdb.init('myApp');
	let action = await menu.openingMenu();
	switch (action.type) {
		case ('launchDefaultDatabaseConnection'):
			return await orbitdb.mkDB([action.data, 'type'], 'kvstore');
		default:
			break;
	}
}

start().then((db) => {
	const testFile = function testFile() {
		fs.readFile('./as1.pdf', async(err, data) => {
			if (err) console.log(err);
			await db.put('testPDF1', data);
			console.log(data);
			let file = db.get('testPDF');
			let c = new Buffer(file.data);
			console.log(c);

			fs.writeFile('success1.pdf', c, (err) => {
				if (err) console.log(err);
			});


		});
	};

	const testFile1 = function testFile() {

	};
	testFile();
	testFile1();


}).catch((err) => {
	console.log(err);
});
