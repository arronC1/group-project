/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// MVC Model Logic //////////////////////////////////

class UserModel {
    constructor(usersSQL) {
      this.table = usersSQL;
    }
  
    async addEntry(username, password, password_hint, students, moduleLeaders, clients, supervisors) {
      // console.log("username = " + username);
      // console.log("password = " + password);
      // console.log("password_hint = " + password_hint);
      // console.log("user_type = " + user_type);

      // Find user in the different actor tables to set type
      
      var user_type;

      console.log("Checking Students");
      await students.getByEmail(username).then (function(result) {
        if(result) {
          console.log("Found Student");
          user_type = "STU";
      }});

      if(!user_type) {
        console.log("Checking Module Leaders");
        await moduleLeaders.getByEmail(username).then (function(result) {
        if(result) {
          console.log("Found Module Leader");
          user_type = "MLE";
        }});
      }

      if(!user_type) {
        console.log("Checking Supervisor");
        await supervisors.getByEmail(username).then (function(result) {
        if(result) {
          console.log("Found Supervisor");
          user_type = "SUP";
        }});
      }

      if(!user_type) {
        console.log("Checking Clients");
        await clients.getByEmail(username).then (function(result) {
        if(result) {
          console.log("Found Client");
          user_type = "CLI";
        }});
      }

      if(user_type) {
        console.log("Adding New User");
        return await this.table.inTransaction(async (t) => {
          await this.table.create(username, password, password_hint, user_type, t);
        });
      } else {
        throw new Error('User not defined');
      }
    }
  
    async getList() {
      return await this.table.getAll();
    }

    async getUserIDs() {
        return await this.table.getUserIDs();
    }
  
    async getUsernames() {
      return await this.table.getUsernames();
    }

    async getPasswords() {
        return await this.table.getPasswords();
    }

    async getPasswordHints() {
        return await this.table.getPasswordHint();
    }

    // Join onto actor table depending on user role
    async login(username, password) {
        const user = await this.table.getUser(username);
        if (!user.validPassword(password)){
          throw new Error('Password not valid');
        }
        // Return this for now, the way we've done users
        // is stupid and needs refactoring
        return user;
        /*if(user.user_type === "STU") {
          return await this.table.getUser(username);
        } 
        else if(user.user_type === "MLE") {
          return await this.table.getUser(username);
        }
        else if(user.user_type === "SUP") {
          return await this.table.getUser(username);
        } 
        else if(user.user_type === "CLI") {
          return await this.table.getUser(username);
        }*/
    }

    async setPassword(user, newPass) {
      return await this.table.inTransaction(async (t) => {
        return await user.update({ password: newPass }, { transaction: t });
      });
    }

    async getUserByID(id) {
      return await this.table.getUserByID(id);
    }

    async getUserType() {
        return await this.table.getUserType();
    }

    async getUser(email) {
      return await this.table.getUser(email);
  }
  
  }
  
  module.exports = UserModel;