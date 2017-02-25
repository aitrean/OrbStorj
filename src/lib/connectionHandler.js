const dirty = require('dirty');
const randomString = require('randomstring');

let localDatabase;

const init = () => {
	return new Promise((resolve, reject) => {
		try {
			localDatabase = dirty('./localkv.db');
			localDatabase.on('load', function() {
				if (localDatabase.get('default') === undefined) {
					localDatabase.set(
						'default', {
							'hash': randomString.generate(34)
						}
					);
				}
				resolve();
			});
		} catch (err) {
			reject(err);
		}
	});
};

const addEntry = (connectionInfo) => {
	if (connectionInfo.hash.length != 34) {
		console.log('That was not an appropriate string, enter again.');
		return false;
	} else if (localDatabase.get(connectionInfo.name)) {
		console.log('There is already a connection string with that name, please choose another name');
		return false;
	} else {
		localDatabase.set(connectionInfo.name, {
			hash: connectionInfo.hash
		});
		return true;
	}
};

const getConnectionList = () => {
	let array = [];
	localDatabase.forEach(function(k, v) {
		array.push({
			'name': k,
			'hash': v.hash
		});
	});
	return array;
};

const get = (key) => {
	return new Promise((resolve, reject) => {
		if (localDatabase.get(key) === undefined) {
			reject('Could not find that connection name, terminating startup.');
		} else {
			resolve(localDatabase.get(key).hash);
		}
	});
};

const exportObj = {
	init: init,
	addEntry: addEntry,
	getConnectionList: getConnectionList,
	get: get
};

module.exports = exportObj;
