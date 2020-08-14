/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// MVC Model Logic //////////////////////////////////

class ProposalReviewModel {
  constructor(proposalReviewSQL) {
    this.table = proposalReviewSQL;
  }

  async create(proposalID, reviewerID, comment) {
    return await this.table.inTransaction(async (t) => {
      await this.table.create(proposalID, reviewerID, comment, t);
    });
  }
}

module.exports = ProposalReviewModel;