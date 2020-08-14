/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// MVC Model Logic //////////////////////////////////

class ModuleLeaderModel {
    constructor(moduleLeadersSQL) {
      this.table = moduleLeadersSQL;
    }

    async getNames() {
      return await this.table.getNames();
    }

    async getByEmail(email) {
      return await this.table.getByEmail(email);
    }
  
  }
  
  module.exports = ModuleLeaderModel;