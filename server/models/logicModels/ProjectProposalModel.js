/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// MVC Model Logic //////////////////////////////////

class ProjectProposalModel {
  constructor(projectProposalSQL) {
    this.table = projectProposalSQL;
  }

  async create(projectID, brief) {
    return await this.table.inTransaction(async (t) => {
      await this.table.create(projectID, brief, t);
    });
  }

  async getList() {
    return await this.table.getAll();
  }

  async getProposalHistory(projectID) {
    return await this.table.getProposalHistory(projectID);
  }

  async getCurrentProposal(projectID) {
    return await this.table.getCurrentProposal(projectID);
  }

  async getStudentsProposal(email, projectGroups, students) {

    let projectProposal;
    try {
      const group =  await students.getStudentGroupDetails(email, projectGroups, students);
      const proposal = await this.table.getCurrentProposal(group[0].dataValues.projectId);
      projectProposal = proposal.dataValues;
    } catch (err) {
      projectProposal = null;
    }

    return await projectProposal;
  }
}

module.exports = ProjectProposalModel;