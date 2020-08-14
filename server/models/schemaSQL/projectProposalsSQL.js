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

async function create(projectID, brief, t) {
  return models.project_proposals.create({
    projectId: projectID,
    //status: 'P', // can hard-code this, newly submitted proposals will always be 'pending review'
    brief: brief
  }, { transaction: t });
}

async function getProposalHistory(projectID) {
  return models.project_proposals.findAll({
    offset: 1,
    order: [['createdAt', 'DESC']],
    include: [{
      model: models.proposal_reviews, 
      required: false,
      include: [{
        model: models.module_leaders, 
      }]
    }],
    where: {projectId: projectID}
  });
}

async function getCurrentProposal(projectID) {
  return models.project_proposals.findOne({
    order: [['createdAt', 'DESC']],
    include: [{
      model: models.proposal_reviews, 
      required: false,
      include: [{
        model: models.module_leaders, 
      }]
    }],
    where: {projectId: projectID}
  });
}

module.exports = (model, _client) => {
  models = model;
  client = _client;

  return {
    create,
    inTransaction,
    getProposalHistory,
    getCurrentProposal
  };
};
