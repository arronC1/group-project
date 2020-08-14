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

async function create(name, description, t) {
  return models.project_groups.create({
    name: name,
    description: description,
  }, { transaction: t });
}

async function update(Gid, name, description, t) {
  return await models.project_groups.update({
        name: name,
        description: description,
      },
      {where: {id: Gid}},
      { transaction: t });

};

async function remove(Gid, t) {
  return await models.project_groups.destroy(
      { where: {id: Gid}},
      { transaction: t });
};

async function getAll() {
  return models.project_groups.findAll({ where: {},
    order: [
      ['name'],
    ]});
}

async function getNames() {
  return models.sequelize.query('SELECT name FROM project_groups ORDER BY name', { model: models.project_groups});
}

async function getGDetails(gid) {
  return models.sequelize.query('SELECT * FROM project_groups where id = ' + gid, {model: models.project_groups});
}
async function getMembers(gid) {
  return models.sequelize.query('SELECT id, firstname, surname, student_number, email FROM students WHERE "projectGroupId" = ' + gid + ' ORDER BY firstname, surname', {model:models.students});
}

async function getGSupervisor(gid) {
  return models.sequelize.query('SELECT supervisors.id, firstname, surname, email FROM project_groups, supervisors WHERE "supervisorId" = supervisors.id AND project_groups.id = ' + gid , {model: models.supervisors});
}

async function getGClient(gid) {
  return models.sequelize.query('SELECT clients.id, firstname, surname, email FROM project_groups, clients, projects WHERE "projectId" = projects.id AND "clientId" = clients.id AND project_groups.id = ' + gid , {model: models.clients});
}

async function getAllByProjectID(projectID) {
  return models.project_groups.findAll({
    where: {projectId: projectID},
    order: [
      ['name'],
    ]
  });
}

async function getAllWithoutProject() {
  return models.project_groups.findAll({
    where: {
      projectId: {
        $eq: null
      }
    },
    order: [
      ['name'],
    ]
  });
}

async function getStudentsGroup(sid) {
  return await models.project_groups.findOne({ where: {} , include: [{model : models.students, where: { id: sid } }], order:[[models.students, 'firstname', 'ASC']]});
}

async function setProjectID(groupID, projectID, t) {
  return models.project_groups.update({
    projectId: projectID
  },
  {where: {id: groupID}}, 
  {transaction: t });
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
    getNames,
    getGDetails,
    getMembers,
    getGSupervisor,
    getGClient,
    getStudentsGroup,
    getAllByProjectID,
    getAllWithoutProject,
    setProjectID
    // setStatus,
  };
};
