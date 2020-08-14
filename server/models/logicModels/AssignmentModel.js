/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// MVC Model Logic //////////////////////////////////

class AssignmentModel {
  constructor(AssignmentsSQL) {
    this.table = AssignmentsSQL;
  }

  async addEntry(title, subdate, maxmark, group_assignment, description) {
    if (group_assignment == 1){
      group_assignment = true;
    } else {
      group_assignment = false;
    }
    return await this.table.inTransaction(async (t) => {
      await this.table.create(title, subdate, maxmark, group_assignment, description, t);
    });
  }

  async updateEntry(Aid, title, subdate, maxmark, group_assignment, description) {
    if (group_assignment == 1){
      group_assignment = true;
    } else {
      group_assignment = false;
    }
    return await this.table.inTransaction(async (t) => {
      await this.table.update(Aid, title, subdate, maxmark, group_assignment, description, t);
    });
  }

  async deleteEntry(Aid) {
    return await this.table.inTransaction(async (t) => {
      await this.table.remove(Aid, t);
    });
  }

  async setFile(file, Aid) {
    return await this.table.inTransaction(async (t) => {
      return await this.table.setFile(file, Aid, t);
    });

  }

  async getList() {
    return await this.table.getAll();
  }

  async getListForStudent(email, students, projectGroups) {
    const student = await students.getByEmail(email);
    const group = await projectGroups.getStudentsGroup(student.dataValues.id)
    const list =  await this.table.getAllforProject(group.dataValues.projectId);
    return list;
  }

  async getProjectAssignment(Aid, student) {
    const projectAssignments = await this.table.getProjectAssignment(Aid, student);
    return projectAssignments[0].id;
  }

  // async getFileName() {
  //   return await this.table.getFileName();
  // }

  async getDetails(Aid) {
    return await this.table.getDetails(Aid);
  }

  async getAssignedProjectsList(Aid) {
    return await this.table.getAssignedProjectsList(Aid);
  }

  async getUnAssignedProjectsList(Aid) {
    return await this.table.getUnAssignedProjectsList(Aid);
  }

  async addProject(Aid, Pid) {
    return await this.table.inTransaction(async (t) => {
      return await this.table.addProject(Aid, Pid, t);
    });
  }

  async removeProject(Aid, Pid) {
    return await this.table.inTransaction(async (t) => {
      return await this.table.removeProject(Aid, Pid, t);
    });
  }

  async isGroupAssignment(Aid) {
    const groupAssignment =  await this.table.getAssignment(Aid);

    return groupAssignment.dataValues.group_assignment;
  }

}

module.exports = AssignmentModel;