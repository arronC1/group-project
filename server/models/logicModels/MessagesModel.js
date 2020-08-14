/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// MVC Model Logic //////////////////////////////////

class MessagesModel {
    constructor(messagesSQL) {
      this.table = messagesSQL;
    }
  
    async addEntry(messageTitle, messageContent, sourceID, destinationID) {
        return await this.table.inTransaction(async (t) => {
            await this.table.create(messageTitle, messageContent, sourceID, destinationID, t);
        });
    }
  
    async getList() {
      return await this.table.getAll();
    }

    async getMessages(uID) {
      return await this.table.getMessages(uID);
    }

    async getDetail(id) {
      return await this.table.getDetail(id);
    }
  }
  
  module.exports = MessagesModel;