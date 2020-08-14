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

async function create(title, subdate, maxmark, group_assignment, description, t) {
  return await models.assignments.create({
    // file: file,
    title: title,
    subdate: subdate,
    maxmark: maxmark,
    group_assignment: group_assignment,
    description: description,
  }, { transaction: t });
}


async function update(Aid, title, subdate, maxmark, group_assignment, description, t) {
  return await models.assignments.update({
        title: title,
        subdate: subdate,
        maxmark: maxmark,
        group_assignment: group_assignment,
        description: description,
      },
      {where: {id: Aid}},
      { transaction: t });

};

async function remove(Aid, t) {
  return await models.assignments.destroy(
      { where: {id: Aid}},
      { transaction: t });
};

async function setFile(file, Aid, t) {
  return models.assignments.update({
    file: file,
      },
      {where: {id: Aid}},
      {transaction: t}
  );
}

//
// async function getFileName() {
//   return models.sequelize.query('SELECT file,description FROM assignments', {raw: true,  model: models.assignments});
// }

async function getAll() {
  return models.assignments.findAll({
    where: {},
    order: [
      ['id', 'ASC'],
    ] });
}

async function getAllforProject(Pid) {
  return models.assignments.findAll({
    where: {},
    include: [
        {model: models.projects,
          where: {id: Pid},
        }],
    order: [
      ['id', 'ASC'],
    ] });
}


async function getProjectAssignment(Aid, student) {
  // return models.project_assignments.findOne({
  //   where: {assignmentId: Aid},
  //   include: [
  //     {model: models.projects,
  //       where: {id: student.dataValues.projectGroupId}}]
  // });

  return models.sequelize.query(
      'SELECT pa.* FROM project_assignments AS pa INNER JOIN projects as p ON pa."projectId" = p.id INNER JOIN project_groups as pg ON pg."projectId" = p.id WHERE pg.id = ' + student.dataValues.projectGroupId + ' AND pa."assignmentId" = ' + Aid + ' ORDER BY pa.id',
      {raw: true, model: models.project_assignments});
}

async function getDetails(Aid) {
  // return models.sequelize.query('SELECT file,description FROM assignments where id = ' + Aid , {model: models.assignments});
  return models.assignments.findOne({where: {id: Aid}});
}

async function getAssignedProjectsList(Aid) {
  return models.assignments.findOne( { where: {id: Aid}, include: [{model: models.projects}] });
}

async function getUnAssignedProjectsList(Aid) {
  // const result = models.projects.findAll( { where: {}, include: [{model: models.assignments, where: {id: {
  //         [models.Sequelize.Op.ne]: Aid
  //       }
  //       }, required: false}] });

  // const result = models.projects.findAll( { where: { '$a$': {[models.Sequelize.Op.eq]: null}}, include: [{model: models.assignments, required: false, as: 'a'}] });
  const result = models.sequelize.query(
      'SELECT p.* FROM projects AS p WHERE p.id NOT IN (SELECT pa."projectId" FROM project_assignments AS pa WHERE pa."assignmentId" = ' + Aid + ') ORDER BY p.id',
      {raw: true, model: models.projects});
  return result;
}


async function addProject(Aid, Pid, t){
  return await models.project_assignments.create({
    projectId: Pid,
    assignmentId: Aid
  }, { transaction: t });
}


async function removeProject(Aid, Pid, t) {
  return await models.project_assignments.destroy(
      { where: {projectId: Pid,
          assignmentId: Aid}},
      { transaction: t });
}

async function getAssignment(Aid) {
  return models.assignments.findOne( { where: {id: Aid} });
}

module.exports = (model, _client) => {
  models = model;
  client = _client;

  return {
    create,
    update,
    remove,
    inTransaction,
    setFile,
    // getFileName,
    getAll,
    getDetails,
    getAssignedProjectsList,
    getUnAssignedProjectsList,
    addProject,
    removeProject,
    getAllforProject,
    getProjectAssignment,
    getAssignment,
  };
};
