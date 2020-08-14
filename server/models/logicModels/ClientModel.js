/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// MVC Model Logic //////////////////////////////////

class ClientModel {
    constructor(clientsSQL) {
      this.table = clientsSQL;
    }
  
    async addEntry(firstname, surname, email) {
      // const data = await this.getData();
      // data.unshift({ name, title, message });
      return await this.table.inTransaction(async (t) => {
        await this.table.create(firstname, surname, email, t);
      });
    }

    async updateEntry(cid, firstname, surname, email) {
        return await this.table.inTransaction(async (t) => {
            await this.table.update(cid, firstname, surname, email, t);
        });
    }

    async deleteEntry(cid) {
        return await this.table.inTransaction(async (t) => {
            await this.table.remove(cid, t);
        });
    }
  
    async getList() {
      return await this.table.getAll();
    }
  
    async getNames() {
      return await this.table.getNames();
    }
  
    async getDetails(cid) {
      return await this.table.getDetails(cid);
    }
  
    async getByEmail(email) {
      return await this.table.getByEmail(email);
    }

    // async getGID() {
    //   return await this.table.getGID();
    // }
  
    async addGroup(cid, gid) {
      return await this.table.addGroup(cid, gid)
    }

    async getGroups(cid) {
        return await this.table.getGroups(cid);
    }

    async getGroupsFromUsername(email) {
        var cid = await this.table.getByEmail(email);
        return await this.table.getGroups(cid.id);
    }

    async getNoClientGroups() {
        return await this.table.getNoClientGroups();
    }

    async removeGroup(gid) {
        return await this.table.removeGroup(gid);
    }
  }
  
  module.exports = ClientModel;