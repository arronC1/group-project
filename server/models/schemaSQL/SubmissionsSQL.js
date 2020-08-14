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

async function create(PAid, student, file, title, t) {
  return await models.submissions.create({
    projectAssignmentId: PAid,
    studentId: student.dataValues.id,
    projectGroupId: student.dataValues.projectGroupId,
    title: title,
    file: file,
  }, { transaction: t });
}


async function update(SUBid, file, title, t) {
  return await models.submissions.update({
        title: title,
        file: file,
      },
      {where: {id: SUBid}},
      { transaction: t });

};

async function remove(SUBid, t) {
  return await models.submissions.destroy(
      { where: {id: SUBid}},
      { transaction: t });
};


async function getAll(Aid, Gid) {
  return models.submissions.findAll({
    where: {},
    include: [
      {model: models.project_groups,
        where: {id: Gid}},
      {model: models.project_assignments,
        where: {assignmentId: Aid}}
        ],
    order: [
      ['id', 'ASC'],

    ] });
}

async function getAllForStudent(Aid, Gid, Sid) {
  return models.submissions.findAll({
    where: {studentId: Sid},
    include: [
      {model: models.project_groups,
        where: {id: Gid}},
      {model: models.project_assignments,
        where: {assignmentId: Aid}}
    ],
    order: [
      ['id', 'ASC'],

    ] });
}

module.exports = (model, _client) => {
  models = model;
  client = _client;

  return {
    inTransaction,
    create,
    update,
    remove,
    getAll,
    getAllForStudent,
  };
};
