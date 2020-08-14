class SupervisorModel {
    constructor(supervisorSQL) {
      this.table = supervisorSQL;
    }
  
    async addEntry(firstname, surname, email) {
      return await this.table.inTransaction(async (t) => {
        await this.table.create(firstname, surname, email, t);
      });
    }

    async updateEntry(sid, firstname, surname, email) {
        return await this.table.inTransaction(async (t) => {
            await this.table.update(sid, firstname, surname, email, t);
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
  
    async getNames() {
      return await this.table.getNames();
    }

    async getDetails(sid) {
      return await this.table.getDetails(sid);
    }
  
    async getByEmail(email) {
      return await this.table.getByEmail(email);
    }

    // async getGID() {
    //   return await this.table.getGID();
    // }
  
    async addGroup(sid, gid) {
      return await this.table.addGroup(sid, gid);
    }

    async getGroups(sid) {
      return await this.table.getGroups(sid);
    }

    async getNoSupervisorGroups() {
        return await this.table.getNoSupervisorGroups();
    }

    async removeGroup(gid) {
        return await this.table.removeGroup(gid);
    }

    async getGroupsFromUsername(email) {
        var sid = await this.table.getByEmail(email);
        return await this.table.getGroups(sid.id);
    }
  }
  
  module.exports = SupervisorModel;