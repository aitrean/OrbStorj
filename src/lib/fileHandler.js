//const orbitdb = require('orbitHandler');
const fs = require('fs');

const readFile = function readFile(fileName) {
	return new Promise((resolve, reject) => {
		fs.readFile(fileName, (err, data) => {
			if (err) {
				return reject(err);
			}
			return resolve(data);
		});
	});
};

const writeFile = function writeFile(fileName, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(fileName, data, (err) => {
			if (err) {
				return reject(err);
			}
			return resolve();
		});
	});
};


module.export({
	readFile,
	writeFile,
});
