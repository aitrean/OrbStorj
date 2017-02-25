const minimist = require('minimist');
const inquirer = require('inquirer-promise');
const package = require('../../package.json');

/**
 * Opening menu interprets CLI arguments, parses, then sends back to controller in OrbStorj
 * @return Promise
 */
const openingMenu = () => {
	let argv = minimist(process.argv.slice(2), {
		boolean: false
	});
	return new Promise((resolve, reject) => {
		if (argv.version) {
			console.log('OrbStorj version ' + package.version);
			resolve();
		} else if (argv.help) {
			console.log('Commands:');
			console.log('version		Displays version of OrbStorj');
			console.log('help		Displays list of commands that operate with OrbStorj');
			console.log('launch		launch into the given database, if no database given, launch default');
			console.log('create		Create new database connection');
			console.log('list		List connection names');
			resolve();
		} else if (argv.launch) {
			console.log('Launching...');
			resolve(launchMenu(argv));
		} else if (argv.create) {
			resolve({
				type: 'createDatabaseConnection',
				data: {}
			});
		} else if (argv.list) {
			resolve({
				type: 'listConnections'
			});
		} else {
			reject('Could not read that command, see --help for more details');
		}
	});
};

const launchMenu = (argv) => {
	if (argv.launch === true) {
		return ({
			type: 'launchDefaultDatabaseConnection',
			data: {}
		});
	} else {
		return ({
			type: 'launchDatabaseConnection',
			data: argv.launch
		});
	}
};

const getDatabaseInfo = () => {
	return new Promise((resolve, reject) => {
		inquirer.prompt([{
				type: 'input',
				name: 'hash',
				message: 'Please paste the address for the new database connection: '
			},
			{
				type: 'input',
				name: 'name',
				message: 'Please enter the name of this connection'
			}
		]).then(data => {
			if (data.hash.length === 0) {
				reject('ERROR: Hash value could not be resolved');
			} else if (data.name.length === 0) {
				reject('ERROR:  Name could not be resolved');
			} else {
				resolve(data);
			}
		});
	});
};

/*
const selectConnection = (connectionList) => {
	listConnections(connectionList);
	inquirer.prompt([{
		'type': rawlist,
		'name': selectedConnection
	}]);
};*/

const listConnections = (connectionList) => {
	for (let i = 0; i < connectionList.length; i++) {
		let str = (i + 1) + '. ' + connectionList[i].name + '\n' + '   Address: ' + connectionList[i].hash;
		console.log(str);
	}
};

const exportObj = {
	openingMenu: openingMenu,
	getDatabaseInfo: getDatabaseInfo,
	listConnections: listConnections
};

module.exports = exportObj;
