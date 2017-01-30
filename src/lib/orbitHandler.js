const OrbitDB = require('orbit-db');
const IPFS = require('ipfs-daemon');
let ipfs;
let appName;

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
    console.log("")
    return new Promise((resolve, reject) => {
        ipfs.on('ready', () => {
            resolve()
        });
        ipfs.on('error', (e) => {
            reject(e)
        });
    });
};

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
        const orbitdb = new OrbitDB(ipfs, appName);
        const db = orbitdb[type](`${appName}.${name}`);
        db.events.on('ready', () => {
            resolve(db);
        });
    });
}

const exportObj = {
    init: init,
    mkDB: mkDB,
};

module.exports = exportObj;
