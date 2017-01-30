const orbitdb = require('orbitHandler')
//make a new db for each field created
const createField = async(fieldName) => {
    return await orbitdb.mkDB(fieldName, 'kvstore');
};

const createProject = async(db, projectObj) => {
    await db.put(projectObj.name, projectObj.structure)
}

const saveProject = async(db, projectObj) => {
    await db.set(projectObj)
}
const getProject = (db, projectName) => {
    return db.get(projectName);
}

const getFile = (project, filePath) => {
  return project.structure.filePath;
}
