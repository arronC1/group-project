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

async function create(proposalID, reviewerID, comment, t) {
  return models.proposal_reviews.create({
    projectProposalId: proposalID,
    moduleLeaderId: reviewerID,
    comment: comment
  }, { transaction: t });
}


module.exports = (model, _client) => {
  models = model;
  client = _client;

  return {
    inTransaction,
    create
  };
};
