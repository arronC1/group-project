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

async function create(firstname, surname, studentNumber, email, t) {
  return await models.students.create({
    firstname: firstname,
    surname: surname,
    student_number: studentNumber,
    email: email,
  }, { transaction: t });
}

async function update(sid, firstname, surname, studentNumber, email, t) {
  return await models.students.update({
        firstname: firstname,
        surname: surname,
        student_number: studentNumber,
        email: email,
      },
      {where: {id: sid}},
      { transaction: t });

};

async function remove(sid, t) {
  return await models.students.destroy(
      { where: {id: sid}},
      { transaction: t });
};

async function getAll() {
  return models.students.findAll({
    where: {},
    order: [
      ['firstname'], ['surname'],
    ]
  });
}

async function getByEmail(email) {
  return await models.students.findOne({ where: {email: email} });
}

// async function getNames() {
//   // return models.sequelize.query('SELECT firstname, surname, student_number FROM students', {raw: true,  model: models.students});
//   return models.students.findAll(attributes:['id', 'firstname', 'surname', 'student_number'] );
// }

async function getDetails(sID) {
  // return models.sequelize.query('SELECT * FROM students where id = ' + sID , {model: models.students});
  return await models.students.findOne({ where: {id: sID} });
}

// async function getGID(){
//   return models.sequelize.query('SELECT id FROM project_groups', { model: models.project_groups});
// }

async function setGID(sID, gID){
  return models.students.update({
        projectGroupId: gID,
      },
      {where: {id: sID}});

  // return models.sequelize.query('UPDATE students SET "projectGroupId" = ' + gid + ' WHERE student_number = \'' + sNo + '\'', {model:models.students});
}

async function removeGID(sid) {
  return await models.students.update({
        projectGroupId: null
      },
      {where: {id: sid}});
};

async function getUngroupedStudents(){
  // return models.sequelize.query('SELECT * FROM students where "projectGroupId" IS NULL', {model:models.students});
  return models.students.findAll({
    where: {projectGroupId: null},
    order: [
      ['firstname'], ['surname'],
    ]
  });
}


async function getStudentsGroup(sid){
  return await models.students.findOne({ where: {id: sid} });
  // return models.sequelize.query('SELECT project_groups.* FROM project_groups, students WHERE "projectGroupId" = project_groups.id AND students.id =' + sid, {model:models.project_groups});
  // return models.sequelize.query('SELECT project_groups.id FROM project_groups, students WHERE "projectGroupId" = project_groups.id AND students.id =' + sid);
  
}

//edit/update a student

//delete a student

//search for a student

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
    // getNames,
    getDetails,
    // getGID,
    setGID,
    removeGID,
    getUngroupedStudents,
    getStudentsGroup,
    // setStatus,
  };
};
