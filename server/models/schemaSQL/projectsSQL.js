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

async function create(name, clientID, t) {
  return models.projects.create({
    name: name,
    clientId: clientID,
    status: "R"
  }, { transaction: t });
}

async function getAll() {
  return models.projects.findAll({ 
    include: [{
        model: models.clients
      }],
    where: {},
    order: [
      ['name'],
    ]
  });
}

async function getList(clientID) {
  return models.projects.findAll({ 
    where: {clientId: clientID},
    order: [
      ['name'],
    ]
  });
}

async function getDetails(projectID) {
  return models.projects.findById(projectID);
}

async function setStatus(projectID, status, t) {
  return models.projects.update({
    status: status
  },
  {where: {id: projectID}}, 
  {transaction: t });
}

async function getClientsProjects(cid) {
  return models.projects.findAll({
    where: {clientId: cid},
    order: [
      ['name'],
    ]});
}

module.exports = (model, _client) => {
  models = model;
  client = _client;

  return {
    create,
    inTransaction,
    getAll,
    getList,
    getDetails,
    setStatus,
    getDetails,
    getClientsProjects,
  };
};
