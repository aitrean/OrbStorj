'use strict';

const menu = require('./lib/consoleMenu');
const orbitdb = require('./lib/orbitHandler');
const fh = require('./lib/fileHandler');
const dirty = require('dirty');
let kvdb;
let evdb;
let orb;
let dbRecord;
let ipfs;
let watcher;
const start = async function start() {
	try {
		dbRecord = dirty('./localkv.db');
		let action = await menu.openingMenu();

		switch (action.type) {

			case ('launchDefaultDatabaseConnection'):
				ipfs = await orbitdb.init('myApp');
				orb = await orbitdb.initOrb();
				kvdb = await orbitdb.mkDB([JSON.stringify(action.data), action.type], 'kvstore');
				evdb = await orbitdb.mkDB([JSON.stringify(action.data), action.type], 'eventlog');
				break;

			case ('launchDatabaseConnection'):
				ipfs = await orbitdb.init(action.data);
				orb = await orbitdb.initOrb();
				kvdb = await orbitdb.mkDB([JSON.stringify(action.data), action.type], 'kvstore');
				evdb = await orbitdb.mkDB([JSON.stringify(action.data), action.type], 'eventlog');
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

		//instantiate file watcher
		//should probably ask user what path they want here
		await fh.init();
		watcher = await fh.watchRoot();
	} catch (err) {
		console.log(err);
	}
};


const main = async function() {
	try{
		await start();
		watcher.on('addDir', (path) =>{
			console.log(`${path} has been added (dir)`);
		});

		watcher.on('add', path => addFile(path));


		orb.events.on('data', (dbname, event) => {
			console.log('\n\nORBITDB EVENT');
			console.log(JSON.stringify(dbname), JSON.stringify(event));
			console.log('\n\n');
		});
	}catch(err){
		console.log(err);
	}
};
main();


const addFile = async function addFile(path) {
	console.log(`${path} has been added`);
	//check if file already exists in kvstore
	let fileExists = kvdb.get(path);

	if (fileExists && fileExists.isDeleted) {
		console.log(`File ${path} already exists in kvdb or was deleted at a future time, ignoring add`);
		return;
	}

	console.log(`File ${path} does not exist in kvdb, adding`);
	try {
		await addTokvdb(path);
		await addToevdb(path);
		console.log(`File ${path} successfully added!`);
	} catch (err) {
		console.log(err);
	}
};

const addToIpfs = function addToIpfs(path) {
	let rs = fh.readStream(path);
	return new Promise((resolve, reject) => {
		ipfs.files.add(rs, (err, res) => {
			if (err) {
				console.log(`Error adding to ipfs ${err}`);
				return reject(err);
			} else {
				//NOTE: callback returns first file added assuming we wont us this
				//for multiple files at the same time
				console.log(`File ${path} added to IPFS`);
				resolve(res[0]);
			}
		});
	});
};


const addToevdb = async function addToevdb(path) {
	//get current iteration this user is at
	const latestEntry = evdb.iterator({
			limit: 1,
			reverse: true
		})
		.collect()
		.map((e) => e.payload.value);
	console.log('Getting latest entry');
	console.log(latestEntry);
	let data = {
		action: 'add',
		files: [path],
	};
	let evEntry = JSON.stringify(new orbitdb.EvObj(data));
	console.log(`Adding ${evEntry} inside evdb`);
	return await evdb.add(evEntry);
};

const addTokvdb = async function addTokvdb(path) {
	let fileAdded = await addToIpfs(path);
	console.log(fileAdded);
	let kvEntry = JSON.stringify(new orbitdb.KvObj(fileAdded));
	console.log(kvEntry);
	console.log(`Putting ${JSON.stringify(kvEntry)} inside kvdb`);
	return await kvdb.put(kvEntry);
};
