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

async function create(messageTitle, messageContent, sourceID, destinationID, t) {

  return await models.messages.create({
    messageTitle: messageTitle,
    messageContent: messageContent,
    sourceUserId: sourceID,
    destinationUserId: destinationID,
  }, { transaction: t });
}

async function getAll() {
  return models.messages.findAll({
    where: {},
    order: [
      ['updatedAt'],
    ]
  });
}

async function getMessages(uID) {
  const result = models.messages.findAll({
    include: [{
      model : models.users, as: 'destinationUser'}],
    where: {destinationUserId: uID},
    order:[
        'updatedAt']
  });
  return result;
}

async function getDetail(id) {
  // return models.sequelize.query('SELECT * FROM messages where "id" = ' + mid , {model: models.messages});
  const result = models.messages.findAll({
    include: [{model : models.users, as: 'sourceUser'}],
    where: {id: id},
    order:[
      'updatedAt'] });
  return result;
}

module.exports = (model, _client) => {
  models = model;
  client = _client;

  return {
    create,
    inTransaction,
    getAll,
    getMessages,
    getDetail,
  };
};
