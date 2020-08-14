/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// MVC Model Database Logic /////////////////////////////

let client = null;
let models = null;

async function inTransaction(work) {
  const t = await client.transaction();

  try {
    await work(t);
    return t.commit();
  } catch (err) {
    t.rollback();
    throw err;
  }
}

async function create(firstname,surname, email, t) {
  return await models.supervisors.create({
    firstname: firstname,
    surname: surname,
    email: email,
  }, { transaction: t });
};

async function update(sid, firstname,surname, email, t) {
  return await models.supervisors.update({
    firstname: firstname,
    surname: surname,
    email: email,
  },
  {where: {id: sid}},
  { transaction: t });

};

async function remove(sid, t) {
  return await models.supervisors.destroy(
    { where: {id: sid}},
    { transaction: t });
};

async function getAll() {
  return models.supervisors.findAll({
    where: {},
    order: [
      ['firstname'], ['surname'],
    ]});
};

async function getByEmail(email) {
  return await models.supervisors.findOne({ where: {email: email} });
}

async function getNames() {
  return models.sequelize.query('SELECT firstname, surname FROM supervisors ORDER BY firstname, surname', { model: models.supervisors});
};

async function getDetails(sid) {
  return models.sequelize.query('SELECT * FROM supervisors where id = ' + sid, {model: models.supervisors});
}

// async function getGID(){
//   return models.sequelize.query('SELECT id FROM project_groups', { model: models.project_groups});
// }

async function addGroup(sid, gid){
  return models.sequelize.query('UPDATE project_groups SET "supervisorId" = ' + sid + ' WHERE id = \'' + gid + '\'', {model:models.project_groups});
}

async function getGroups(sid) {
  // return models.project_groups.findAll({ where: {sid: sid}});
  return models.sequelize.query('SELECT * FROM project_groups where "supervisorId" = ' + sid + ' ORDER BY name', {model: models.project_groups});
  // return models.project_groups.findAll({ where: {supervisorId : sid} });
  
}

async function getNoSupervisorGroups() {
  // return models.project_groups.findAll({ where: {sid: sid}});
  return models.sequelize.query('SELECT * FROM project_groups where "supervisorId" is NULL ORDER BY name', {model: models.project_groups});
  // return models.project_groups.findAll({ where: {supervisorId : sid} });

}

async function removeGroup(gid) {
  // return models.project_groups.findAll({ where: {sid: sid}});
  return models.sequelize.query('UPDATE project_groups SET "supervisorId" = NULL WHERE id = ' + gid, {model: models.project_groups});
  // return models.project_groups.findAll({ where: {supervisorId : sid} });

}

module.exports = (model, _client) => {
  models = model;
  client = _client;

  return {
    create,
    update,
    remove,
    inTransaction,
    getAll,
    getByEmail,
    getNames,
    getDetails,
    // getGID,
    addGroup,
    getGroups,
    getNoSupervisorGroups,
    removeGroup,
  };
};