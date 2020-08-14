/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// MVC Model Logic //////////////////////////////////

class ProjectGroupModel {
  constructor(projectGroupSQL) {
    this.table = projectGroupSQL;
  }

  async addEntry(name, description) {
    // const data = await this.getData();
    // data.unshift({ name, title, message });
    // return await this.table.inTransaction(async (t) => {
    //   await this.table.create(name, description, t);
    // });
    return this.table.create(name, description);
  }

  async updateEntry(Gid, name, description) {
    return await this.table.inTransaction(async (t) => {
      await this.table.update(Gid, name, description, t);
    });
  }

  async deleteEntry(Gid) {
    return await this.table.inTransaction(async (t) => {
      await this.table.remove(Gid, t);
    });
  }

  async getList() {
    return await this.table.getAll();
  }

  async getNames() {
    return await this.table.getNames();
  }

  async getGDetails(gid) {
    return await this.table.getGDetails(gid);
  }

  async getMembers(gid) {
    return await this.table.getMembers(gid);
  }

  async getGSupervisor(gid) {
    return await this.table.getGSupervisor(gid);
  }

  async getGClient(gid) {
    return await this.table.getGClient(gid);
  }

  async getStudentsGroup(sid) {
    return await this.table.getStudentsGroup(sid);
  }

  async getAllByProjectID(projectID) {
    return await this.table.getAllByProjectID(projectID);
  }

  async getAllWithoutProject() {
    return await this.table.getAllWithoutProject();
  }

  async setProjectID(groupID, projectID) {
    return await this.table.inTransaction(async (t) => {
      return await this.table.setProjectID(groupID, projectID, t);
    });
  }

}

module.exports = ProjectGroupModel;