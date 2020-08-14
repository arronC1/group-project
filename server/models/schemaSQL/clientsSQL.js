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

async function create(firstname, surname, email, t) {
  return await models.clients.create({
    firstname: firstname,
    surname: surname,
    email: email,
  }, { transaction: t });
}

async function update(cid, firstname,surname, email, t) {
  return await models.clients.update({
        firstname: firstname,
        surname: surname,
        email: email,
      },
      {where: {id: cid}},
      { transaction: t });

};

async function remove(cid, t) {
  return await models.clients.destroy(
      { where: {id: cid}},
      { transaction: t });
};

async function getAll() {
  return models.clients.findAll({ where: {}, order: [
      ['firstname', 'ASC'], ['surname', 'ASC']
    ] });
}

async function getByEmail(email) {
  return await models.clients.findOne({ where: {email: email} });
}

async function getNames() {
  return models.sequelize.query('SELECT firstname, surname FROM clients ORDER BY firstname, surname', {raw: true,  model: models.clients});
}

async function getDetails(cid) {
  return models.sequelize.query('SELECT * FROM clients where id = ' + cid + ' ORDER BY firstname, surname', {model: models.clients});
}

// async function getGID(){
//   return models.sequelize.query('SELECT id FROM project_groups', { model: models.project_groups});
// }

// async function addGroup(cid, gid){
//   return models.sequelize.query('UPDATE project_groups SET "clientId" = ' + cid + ' WHERE id = ' + gid, {model:models.project_groups});
// }

async function getGroups(cid) {
  // return models.project_groups.findAll({ where: {sid: sid}});
  return models.sequelize.query('SELECT project_groups.* FROM project_groups, projects where "projectId" = projects.id AND "clientId" = ' + cid + ' ORDER BY project_groups.name', {model: models.project_groups});
  // return models.project_groups.findAll({ where: {supervisorId : sid} });

}

// async function removeGroup(gid) {
//   // return models.project_groups.findAll({ where: {sid: sid}});
//   return models.sequelize.query('UPDATE project_groups SET "clientId" = NULL WHERE id = ' + gid, {model: models.project_groups});
//   // return models.project_groups.findAll({ where: {supervisorId : sid} });
//
// }

async function getNoClientGroups() {
  // return models.project_groups.findAll({ where: {sid: sid}});
  return models.sequelize.query('SELECT project_groups.* FROM project_groups, projects where "projectId" = projects.id AND "clientId" is NULL ORDER BY project_groups.name ', {model: models.project_groups});
  // return models.project_groups.findAll({ where: {supervisorId : sid} });

}
//edit/update a client

//delete a client

//search for a client

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
    // addGroup,
    getGroups,
    getNoClientGroups,
    // removeGroup,
    // setStatus,
  };
};
