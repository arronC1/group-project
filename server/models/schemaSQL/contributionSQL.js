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

async function create(hours, tasks, week, sID, gID, t) {
  return await models.contribution.create({
    hours: hours,
    tasks: tasks,
    week: week,
    studentId: sID,
    projectGroupId: gID,
  }, { transaction: t });
}

async function update(hours, tasks, week, sID, gID, t) {
  return await models.contribution.update({
        hours: hours,
        tasks: tasks,
      },
      {where: {studentId: sID, week: week}},
      { transaction: t });
}

async function remove(sid, week, t) {
  return await models.contribution.destroy(
      { where: {id: sid, week: week}},
      { transaction: t });
};

async function getExistingEntry(sid, week) {
  return models.contribution.findOne({ where: {studentId:sid, week: week} });
}

async function getAll() {
  return models.contribution.findAll({
    where: {},
    order: [
      ['week', 'ASC'],
    ] });
}

async function getWeeks(PGid) {
  return models.contribution.findAll({
    where: {
      projectGroupId: PGid
    },
    order:[
        ['week', 'ASC'],
    ],
    attributes:['week'],
    group:['week']});
}

async function getTotalContribution(sNo) {
  return models.contribution.sum('hours', {where: {studentId : sNo}});
}

async function getGroupAvgCont(gNo) {
  // return models.sequelize.query('SELECT AVG(hours) FROM contributions WHERE "projectGroupId" = ' + gNo, {model:models.contribution});
  return models.contribution.findOne({
    attributes: [
        [models.sequelize.fn('AVG', models.sequelize.col('hours')), 'avgHours']],
    where: {
      projectGroupId: gNo,
    }});
}

async function getGroupAvgContByStudent(gNo) {
  // return models.sequelize.query('SELECT AVG(hours) FROM contributions WHERE "projectGroupId" = ' + gNo, {model:models.contribution});
  return models.contribution.findAll({
    attributes: [
      'studentId',
      [models.sequelize.fn('AVG', models.sequelize.col('hours')), 'avgHours']],
    group: 'studentId',
    where: {
      projectGroupId: gNo,
      // studentId: {[models.sequelize.Op.ne]: Sid}
    }});
}

async function getGroupLog(gNo, weekNo) {
  return await models.contribution.findAll({ where: {projectGroupId: gNo, week: weekNo} , include: [{model : models.students, required: false}], order:[['week', 'ASC'], [models.students, 'firstname', 'ASC']]});
}

async function getCompleteGroupLog(gNo) {
  return await models.contribution.findAll({ where: {projectGroupId: gNo} , include: [{model : models.students, required: false}], order:[['week', 'ASC'], [models.students, 'firstname', 'ASC']]});
}

module.exports = (model, _client) => {
  models = model;
  client = _client;

  return {
    create,
    update,
    remove,
    inTransaction,
    getExistingEntry,
    getAll,
    getWeeks,
    getTotalContribution,
    getGroupAvgCont,
    getGroupAvgContByStudent,
    getGroupLog,
    getCompleteGroupLog,
  };
};