/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// MVC Model Logic //////////////////////////////////

class SubmissionsModel {
  constructor(SubmissionsSQL) {
    this.table = SubmissionsSQL;
  }

  async addEntry(Aid, assignments, email, students, file, title) {
    const student = await students.getByEmail(email);
    const PAid = await assignments.getProjectAssignment(Aid, student)
    return await this.table.inTransaction(async (t) => {
      await this.table.create(PAid, student, file, title, t);
    });
  }

  async deleteEntry(SUBid) {
    return await this.table.inTransaction(async (t) => {
      await this.table.remove(SUBid, t);
    });
  }

  async getSubmissionsList(Aid, email, students, assignments) {
    const student = await students.getByEmail(email);
    const groupAssignment = await assignments.isGroupAssignment(Aid);

    if(groupAssignment) {
        return await this.table.getAll(Aid, student.dataValues.projectGroupId);
    } else {
        return await this.table.getAllForStudent(Aid, student.dataValues.projectGroupId, student.dataValues.id);
    }

  }

}

module.exports = SubmissionsModel;