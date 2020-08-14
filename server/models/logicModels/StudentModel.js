/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// MVC Model Logic //////////////////////////////////

class StudentModel {
  constructor(studentsSQL) {
    this.table = studentsSQL;
  }

  async addEntry(firstname, surname, studentNumber, email) {
    // const data = await this.getData();
    // data.unshift({ name, title, message });
    return await this.table.inTransaction(async (t) => {
      await this.table.create(firstname, surname, studentNumber, email, t);
    });
  }

  async updateEntry(sid, firstname, surname, studentNumber, email) {
    return await this.table.inTransaction(async (t) => {
      await this.table.update(sid, firstname, surname, studentNumber, email, t);
    });
  }

  async deleteEntry(sid) {
    return await this.table.inTransaction(async (t) => {
      await this.table.remove(sid, t);
    });
  }
  async getList() {
    return await this.table.getAll();
  }

  // async getNames() {
  //   return await this.table.getAll();
  // }

  async getDetails(sID) {
    return await this.table.getDetails(sID);
  }

  async getByEmail(email) {
    console.log('getting student by email');
    return await this.table.getByEmail(email);
  }

  // async getGID() {
  //   return await this.table.getGID();
  // }

  async setGID(sID, gid) {
    return await this.table.setGID(sID, gid);
  }

  async removeGID(sID) {
    return await this.table.removeGID(sID);
  }

  async getUngroupedStudents(){
    return await this.table.getUngroupedStudents();
  }

  async getStudentsGroup(sid){
    return await this.table.getStudentsGroup(sid);
  }

  async getStudentsGMembers(email, students, projectGroups){
    const student = await students.getByEmail(email);
    return await projectGroups.getMembers(student.projectGroupId);
  }

  async getStudentGroupDetails(email, projectGroups, students){
    const student = await students.getByEmail(email);
    const groups = await projectGroups.getGDetails(student.projectGroupId);
    return groups;
  }

  async getGroupSupervisor(email, students, projectGroups){
    const student = await students.getByEmail(email);
    const sup = await projectGroups.getGSupervisor(student.projectGroupId);
    return sup;
  }

  async getGroupClient(email, students, projectGroups){
    const student = await students.getByEmail(email);
    const client =  await projectGroups.getGClient(student.projectGroupId);
    return client;
  }

}

module.exports = StudentModel;