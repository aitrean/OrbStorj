const fs = require('fs');
const os = require('os');
const chokidar = require('chokidar');
/*
	This file explictly only handles FS type actions
	IPFS file actions should be in a seperate file
	Then a third file should combine functionality between the two
*/
const createMainDir = function createMainDir(path = `${os.homedir()}/OrbStorj`) {
	return new Promise((resolve, reject) => {
		fs.mkdir(path, (err) => {
			//check if err is that folder already exists
			if (err) {
				if (err.code === 'EEXIST') {
					console.log(`${path} already exists, skipping creation`);
					return resolve();
				} else {
					const errorMsg = `Err: could not create folder at ${path}`;
					console.log(err);
					return reject(errorMsg);
				}
			}
			console.log(`successfully created path at ${path}`);
			return resolve();
		});
	});
};

const watchMainDir = function watchMainDir(path = `${os.homedir()}/OrbStorj`, ignoreDotFiles = false) {
	let watcher;
	const awaitWriteFinish = {
		//20 sec
		stabilityThreshold: 2000
	};

	if (ignoreDotFiles) {
		watcher = chokidar.watch(path, {
			ignored: /^(|[\/\\])\../,
			awaitWriteFinish,
			ignoreInitial: true
		});
	} else {
		watcher = chokidar.watch(path, {
			awaitWriteFinish,
			ignoreInitial: true,
		});
	}
	console.log(`watcher instantiated at ${path}`);
	return watcher;
};

const watchEvents = function watchEvents(watcher) {
	// Something to use when events are received.
	let log = console.log.bind(console);
	// Add event listeners.
	watcher
		.on('add', path => log(`File ${path} has been added`))
		.on('change', path => log(`File ${path} has been changed`))
		.on('unlink', path => log(`File ${path} has been removed`));

	// More possible events.
	watcher
		.on('addDir', path => log(`Directory ${path} has been added`))
		.on('unlinkDir', path => log(`Directory ${path} has been removed`))
		.on('error', error => log(`Watcher error: ${error}`))
		.on('ready', () => log('Initial scan complete. Ready for changes'))
		.on('raw', (event, path, details) => {
			log('Raw event info:', event, path, details);
		});
};



const readFileAsync = function readFileAsync(fileName) {
	return new Promise((resolve, reject) => {
		fs.readFile(fileName, (err, data) => {
			if (err) {
				return reject(err);
			}
			return resolve(data);
		});
	});
};

/**
 * read file stream wrapper, for additional options later on
 * @param  {string} fileName [path to read from]
 * @return {stream}          [read stream]
 */
const readFileStream = function readFileStream(filename) {
	let rs = fs.createReadStream(filename);
	return rs;
};
/**
 * write file stream wrapper, for additional options later on
 * @param  {string} fileName [path to write to]
 * @return {stream}          [write stream]
 */
const writeFileStream = function writeFileStream(fileName) {
	let ws = fs.createWriteStream(fileName);
	return ws;
};

/**
 * [Promise wrpper for write file async]
 * @param  {string} fileName [name/path of file to write]
 * @param  {buffer} data     [buffer containing data to write]
 * @return {bool}          [success/fail]
 */
const writeFileAsync = function writeFileAsync(fileName, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(fileName, data, (err) => {
			if (err) {
				return reject(err);
			}
			return resolve();
		});
	});
};

const moveFiles = function moveFiles(){

};
const exportObj = {
	init: createMainDir,
	watchRoot: watchMainDir,
	watchEvents: watchEvents,
	readStream: readFileStream,
	writeStream: writeFileStream,
	readFile: readFileAsync,
	writeFile: writeFileAsync,
	mv: moveFiles,
};

module.exports = exportObj;
