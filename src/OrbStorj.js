'use strict';

const orbitdb = require('./lib/orbitHandler');
const fs = require('fs');


const start = async function start() {
	await orbitdb.init('myApp');
	let myDb = await orbitdb.mkDB(['begin', 'here'], 'kvstore');
	return myDb;
};
//start();
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

	}

	const testFile1 = function testFile() {

	};



	testFile();
	testFile1();


}).catch((err) => {
	console.log(err);
});
