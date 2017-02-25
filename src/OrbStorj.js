'use strict';

const menu = require('./lib/consoleMenu');
const orbitdb = require('./lib/orbitHandler');
const fh = require('./lib/fileHandler');
const eventify = require('./lib/eventify');
const dbRecord = require('./lib/connectionHandler');

let kvdb;
let evdb;
let orb;
let ipfs;
let watcher;

const start = async function start() {
	try {
		await dbRecord.init();
		let action = await menu.openingMenu();

		switch (action.type) {

			case ('launchDefaultDatabaseConnection'):
				ipfs = await orbitdb.init('myApp');
				orb = await orbitdb.initOrb();
				kvdb = await orbitdb.mkDB('', 'kvstore');
				evdb = await orbitdb.mkDB('', 'eventlog');
				break;

			case ('launchDatabaseConnection'):
				{
					ipfs = await orbitdb.init(action.data);
					orb = await orbitdb.initOrb();

					let connectionAddress = await dbRecord.get(action.data);

					kvdb = await orbitdb.mkDB(connectionAddress, 'kvstore');
					evdb = await orbitdb.mkDB(connectionAddress, 'eventlog');
					break;
				}

			case ('createDatabaseConnection'):
				{
					let entrySuccessful;
					let newDatabaseInfo;
					while (entrySuccessful != true) {
						newDatabaseInfo = await menu.getDatabaseInfo();
						entrySuccessful = dbRecord.addEntry(newDatabaseInfo);
					}
					break;
				}

			case ('listConnections'):
				{
					menu.listConnections(dbRecord.getConnectionList());
					break;
				}

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
	try {
		await start();
		//test for peers
		/*
		setInterval(async() => {
			let peers = await ipfs.swarm.peers();
			peers.map((e) => {
				console.log(String(e.addr));
			});
		}, 1000);
		 */

		watcher.on('addDir', (path) => {
			console.log(`${path} has been added (dir)`);
		});

		watcher.on('add', path => addFile(path));

		evdb.events.on('data', (dbname, event) => {
			console.log('\n EVDB EVENT');
			console.log(dbname, event);
			console.log(event.payload.value);
			const value = JSON.parse(event.payload.value);
			console.log(value.action);
			switch (value.action) {
				case 'add':
					syncAdd(value.files);
					break;

				default:
					break;
			}
			//check if already exists
			//if(await fh.fileExists(event.payload.value))
			console.log();
			console.log('\n');
		});
		/*
		eventify.prmify([{
			event: orb.events,
			type: 'data'
		}], (res) => {
			console.log('FIRED');
			console.log(JSON.stringify(res, null, 2));
		});
		 */




	} catch (err) {
		console.log(err);
	}
};
main();

const syncAdd = async function syncAdd(files) {
	for (let f of files) {
		//if the file exists
		console.log(kvdb.get(f));
		console.log(await fh.exists(f));
		if (await fh.exists(f)) {
			console.log(`${f} already exists`);
		} else {
			console.log(`${f} does not exist, syncing to FS`);
			let val = JSON.parse(kvdb.get(f));
			console.log(`got
					Hash: ${val.hash} |
					Path: ${val.path} |
					Size(bytes): ${val.size}
					from kv`);
			let hash = val.hash;
			getFromIpfs(f, hash);
		}
	}

};
const addFile = async function addFile(path) {
	console.log(`${path} has been added`);
	//check if file already exists in kvstore
	/*
	let fileExists = kvdb.get(path);
	if (fileExists) {
		console.log(`File ${path} already exists in kvdb or was deleted at a future time, ignoring add`);
		return;
	}*/

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
		ipfs.files.add([{
			path: path,
			content: rs
		}], (err, res) => {
			if (err) {
				console.log(`Error adding to ipfs ${err}`);
				return reject(err);
			} else {
				//NOTE: callback returns first file added assuming we wont us this
				//for multiple files at the same time
				console.log(`File ${path} added to IPFS`);
				console.log(res);
				resolve(res[0]);
			}
		});
	});
};

const getFromIpfs = function getFromIpfs(path, hash) {
	ipfs.files.cat(hash, (err, stream) => {
		if (err) {
			return console.log(`Error retriving ${hash} from IPFS`);
		} else {
			let ws = fh.writeStream(path);
			stream.pipe(ws);
			ws.on('end', () => {
				console.log('Writing ${path} finished!');
			});
		}
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
	let evEntry = JSON.stringify(new orbitdb.EvObj(data), null, 2);
	console.log(`Adding ${evEntry} inside evdb`);
	return await evdb.add(evEntry);
};

const addTokvdb = async function addTokvdb(path) {
	let fileAdded = await addToIpfs(path);
	console.log(fileAdded);
	let kvEntry = JSON.stringify(new orbitdb.KvObj(fileAdded), null, 2);
	console.log(kvEntry);
	console.log(`Putting ${kvEntry} inside kvdb`);
	return await kvdb.put(path, kvEntry);
};
