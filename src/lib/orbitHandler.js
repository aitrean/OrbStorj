const OrbitDB = require('orbit-db');
const IPFS = require('ipfs-daemon');
let ipfs;
let appName;
let orbitdb;

/**
 * Initializes IPFS
 * @param  {string} name name of the app to apply to DB's
 * @return {null}      none
 */
const init = (name) => {
	appName = name;
	const ipfsOptions = {
		IpfsDataDir: '/tmp/' + appName,
		Addresses: {
			API: '/ip4/127.0.0.1/tcp/0',
			Swarm: ['/ip4/0.0.0.0/tcp/0'],
			Gateway: '/ip4/0.0.0.0/tcp/0',
		},
	};

	ipfs = new IPFS(ipfsOptions);

	return new Promise((resolve, reject) => {
		ipfs.on('ready', () => {
			return resolve(ipfs);
		});
		ipfs.on('error', (e) => {
			return reject(e);
		});
	});
};


const initOrb = () => {
 	orbitdb = new OrbitDB(ipfs, appName);
	return orbitdb;
}
/**
 * Create a DB instance with name and data type
 * @param  {Array} name An array of names
 * @param  {string} type kvstore/eventlog/feed/docstore
 * @return {Object}      DB of above properties returned
 */
const mkDB = (name, type) => {
	//concatenate name into string
	name = name.join('.');
	return new Promise((resolve, reject) => {
		const db = orbitdb[type](`${appName}.${name}`);
		db.events.on('ready', () => {
			return resolve(db);
		});
	});
};

class KvObj {
	constructor(opts) {
		(opts.isDeleted ?
			this.isDeleted = true :
			this.isDeleted = false);
		this.path = opts.path;
		this.hash = opts.hash;
		this.size = opts.size;
	}
}

class EvObj {
	constructor(opts) {
		this.action = opts.action;
		this.files = opts.files;
	}
}
const exportObj = {
	init: init,
	initOrb,
	mkDB: mkDB,
	KvObj,
	EvObj,
};

module.exports = exportObj;
