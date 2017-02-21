//const orbitdb = require('orbitHandler');
const fs = require('fs');
const chokidar = require('chokidar');

const createMainDir = function createMainDir(os = 'linux', path = '~/OrbStorj') {
	return new Promise((resolve, reject) => {
		fs.mkdir(path, (err) => {
			//check if err is that folder already exists
			if (err) {
				if (err === 'EEXIST') {
					console.log(`${path} already exists, skipping creation`);
					resolve();
				} else {
					const err = `Err: could not create folder at ${path}`;
					reject(err);
				}
				resolve();
			}
		});
	});
};

const watchMainDir = function watchMainDir(os = 'linux', path = '~/OrbStorj', ignoreDotFiles = false) {
	let watcher;
	const awaitWriteFinish = {
		//20 sec
		stabilityThreshold: 20000
	};

	if (ignoreDotFiles) {
		watcher = chokidar.watch(path, {
			ignored: /^(|[\/\\])\../,
			awaitWriteFinish,
			ignoreInitial: true
		});
	} else {
		watcher = chokidar.watch(path,{
			awaitWriteFinish,
			ignoreInitial: true,
		});
	}
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

const writeToIpfs = async function writeToIpfs(fileName, data) {
	try {
		let data = await readFileAsync('as1.pdf');
		await db.put('testPDF1', data);
		console.log(data);
		let file = db.get('testPDF');
		let c = new Buffer(file.data);
		console.log(c);

		await fsAsync.writeFile('success.pdf', c);
	} catch (e) {
		console.log(e);
	}
};

module.export = {
	readFile: readFileAsync,
	writeFile: writeFileAsync,
};
