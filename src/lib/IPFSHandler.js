const fh = require('./fileHandler');

/**
 * handle combining FS and IPFS actions in this class
 * and encapsulate ipfs/kvstore/eventlog instances into one object
 * then we can handle all events under one object in OrbStorj.js
 * and use these abstracted methods to interface with IPFS and FS at the same time
 * via read/write streams and moving files 
 */
class IPFSHandler{
  constructor(ipfs, kvstore, eventlog){
    this.kvstore = kvstore;
    this.eventlog = eventlog;
    this.ipfs = ipfs;
    this.fileWatcher = fh.watchRoot();
  }


  async add(){

  }
  async remove(){

  }
  async move(){

  }
  async update(){

  }
}
/**
 * combine the emitted events of ipfs, kvstore, eventlog into under single entity
 * for IPFSHandler to return
 */
function setEvents(){

}
