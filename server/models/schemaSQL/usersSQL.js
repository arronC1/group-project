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

async function create(username, password, password_hint, user_type, t) {
  return models.users.create({
    username: username,
    password: password,
    password_hint: password_hint,
    user_type: user_type,
  }, { transaction: t });
}

async function getAll() {
  return models.users.findAll({ where: {} });
}

async function getUser(username) {
  return models.users.findOne({ where: { username: username }});
}

/*
async function getStudent(username) {
  return models.users.findOne({
    include: [{
      model: models.students
    }],
    where: {username}});
}

async function getSupervisor(username) {
 
}

async function getClient(username) {
  
}

async function getModuleLeader(username) {
  
}
*/

async function getUserByID(id) {
  return models.users.findOne({ where: { id: id }});
}

async function getUserIDs() {
    return models.sequelize.query('SELECT id FROM users', { model: models.users});
}

async function getUsernames() {
    return models.sequelize.query('SELECT username FROM users', { model: models.users});
}

async function getPasswords() {
    return models.sequelize.query('SELECT password FROM users', { model: models.users});
}

async function getPasswordHints() {
    return models.sequelize.query('SELECT password_hint FROM users', { model: models.users});
}

async function getUserType() {
    return models.sequelize.query('SELECT user_type FROM users', { model: models.users});
}

module.exports = (model, _client) => {
  models = model;
  client = _client;

  return {
    create,
    inTransaction,
    getAll,
    getUser,
    getUserByID,
    getUserIDs,
    getUsernames,
    getPasswords,
    getPasswordHints,
    getUserType,
    getUser,
  };
};
