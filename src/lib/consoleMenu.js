const cli = require('clui');
const inquirer = require('inquirer');
const minimist = require('minimist');
const package = require('../../package.json');

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
			console.log('--version: Displays version of OrbStorj');
			resolve();
		} else if (argv.launch) {
			console.log('Launching...');
			resolve(launchMenu(argv));
		}
	});
};

//TODO: implement menu for user input

const launchMenu = (argv) => {
	if (argv) {
		return ({
			type: 'launchDatabaseConnection',
			data: {
				argv
			}
		});
	} else {
		return ({
			type: 'launchDefaultDatabaseConnection',
			data: {}
		});
	}
};

const exportObj = {
	openingMenu: openingMenu
};

module.exports = exportObj;
