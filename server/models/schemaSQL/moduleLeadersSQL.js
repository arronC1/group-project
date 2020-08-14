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

async function getByEmail(email) {
  return await models.module_leaders.findOne({ where: {email: email} });
}

async function getNames() {
  return models.sequelize.query('SELECT firstname, surname, email FROM module_leaders', { model: models.module_leaders});
}

module.exports = (model, _client) => {
  models = model;
  client = _client;

  return {
    inTransaction,
    getByEmail,
    getNames,
    // setStatus,
  };
};
