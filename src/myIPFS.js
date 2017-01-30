'use strict'

const orbitdb = require('./lib/orbitHandler');

async function start(){
  await orbitdb.init('myApp');
  let myDb = await orbitdb.mkDB(['begin', 'here'], 'kvstore');
  
  await myDb.put('hih','poopy')
  console.log(myDb.get('hih'));
};
start();
