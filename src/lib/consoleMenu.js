const minimist = require('minimist');
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
			resolve();
		} else if (argv.launch) {
			console.log('Launching...');
			resolve(launchMenu(argv));
		} else {
			reject('Could not read that command, see --help for more details');
		}
	});
};

//TODO: implement menu for user input

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

const exportObj = {
	openingMenu: openingMenu
};

module.exports = exportObj;

