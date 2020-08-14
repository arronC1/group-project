/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// MVC Model Logic //////////////////////////////////

class ProjectModel {
  constructor(projectSQL) {
    this.table = projectSQL;
  }

  async create(name, clientID) {
    // const data = await this.getData();
    // data.unshift({ name, title, message });
    return await this.table.inTransaction(async (t) => {
      await this.table.create(name, clientID, t);
    });
  }

  // Used for the module leaders who see all projects
  async getAll() {
    return await this.table.getAll();
  }

  // Used for the clients who should only see their projects
  async getList(clientID) {
    return await this.table.getList(clientID);
  }

  async getDetails(projectID) {
    return await this.table.getDetails(projectID);
  }

  async setStatus(projectID, status) {
    return await this.table.inTransaction(async (t) => {
      return await this.table.setStatus(projectID, status, t);
    });
  }

  async getClientsProjects(email, clients) {
    var client = await clients.getByEmail(email);
    return await this.table.getClientsProjects(client.id);
  }
}

module.exports = ProjectModel;