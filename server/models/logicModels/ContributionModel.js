/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// MVC Model Logic //////////////////////////////////

class ContributionModel {
    constructor(contributionSQL) {
      this.table = contributionSQL;
    }
  
    async addEntry(hours, tasks, week, email, students) {
      const student = await students.getByEmail(email);

      //check if entry already exists - if it does update rather than create new
        const exists = await this.table.getExistingEntry(student.id, week);
        if(exists){
            return await this.table.inTransaction(async (t) => {
                await this.table.update(hours, tasks, week, student.id, student.projectGroupId, t);
            });
        }
      return await this.table.inTransaction(async (t) => {
        await this.table.create(hours, tasks, week, student.id, student.projectGroupId, t);
      });
    }

    async updateEntry(hours, tasks, week, email, students) {
        const student = await students.getByEmail(email);

        return await this.table.inTransaction(async (t) => {
            await this.table.update(hours, tasks, week, student.id, student.projectGroupId, t);
        });
    }

    async deleteEntry(sid, week) {
        return await this.table.inTransaction(async (t) => {
            await this.table.remove(sid, week, t);
        });
    }
  
    async getList() {
      return await this.table.getAll();
    }

    async getWeeksForStudentGroup(email, students) {
        console.log('username: ' + email)
        const student = await students.getByEmail(email);
        console.log('student retrieved: ' + student.id)
        console.log('group id is: ' + student.projectGroupId)

        return await this.table.getWeeks(student.projectGroupId);
    }

    async getWeeksForGroup(Gid) {
        console.log('group id is: ' + Gid)
        return await this.table.getWeeks(Gid);
    }
    
    async getGroupWeeklyContribution(email, weekNo, students) {
      //get the student for the session user
      console.log('inside get group cont method');
        const student = await students.getByEmail(email);
      console.log('student retrieved: ' + student.id)
      console.log('username: ' + email)
      //use student to find group id
      // var group = await students.getStudentsGroup(student.id);
      console.log('group id is: ' + student.projectGroupId)
      //get all students in the group
        const groupLog = await this.table.getGroupLog(student.projectGroupId, weekNo);
      console.log('group log : ' + groupLog)
      // console.log('group log surname : ' + groupLog[0].student.surname)
      // get current user contribution
      // const contribution = await 
      // get contribution of all team members
      // const teamContributions = await

      return groupLog;
    }

    async supWeeklyCont(gid, weekNo) {
        return await this.table.getGroupLog(gid, weekNo);
    }

    async getTotalContribution(email, students) {
        const student = await students.getByEmail(email);
        const totalHours = await this.table.getTotalContribution(student.id);
      //if no valid response is returned, return 0 instead
      if(!totalHours){
        return 0;
      }
      return totalHours;
    }

    async getGroupAvgCont(email, students) {
      const student = await students.getByEmail(email);
      const avgCont = await this.table.getGroupAvgContByStudent(student.projectGroupId);
      //if no valid response is returned, return 0 instead
      if(!avgCont){
        console.log('AvgHours1: ' + avgCont.dataValues.avgHours);
        return 0;
      }

      // calc average student contribution excluding current student
      let total=0;
      for (let i = 0; i < avgCont.length; i++) {
          if(avgCont[i].dataValues.studentId != student.id) {
              total = total + Number(avgCont[i].dataValues.avgHours);
          }
      }
      // average excluding current student
      let avg = total / (avgCont.length-1);
      // convert to 2 decimal places
      avg = (Math.round(avg*100)/100)

      return avg;
    }

    async supGroupAvg(gid) {
        const avgCont = await this.table.getGroupAvgCont(gid);
        //if no valid response is returned, return 0 instead
        if(!avgCont.dataValues.avgHours){
            console.log('AvgHours1: ' + avgCont.dataValues.avgHours);
            return 0;
        }
        let avg = (Math.round(avgCont.dataValues.avgHours*100)/100)

        return avg;
    }

    async getGroupContribution(email, students) {
      //get the student for the session user
      console.log('inside get group cont method');
        const student = await students.getByEmail(email);
      console.log('student retrieved: ' + student.id)
      console.log('username: ' + email)
      //use student to find group id
      // var group = await students.getStudentsGroup(student.id);
      console.log('group id is: ' + student.projectGroupId)
      //get all students in the group
        const groupLog = await this.table.getCompleteGroupLog(student.projectGroupId);
      console.log('group log : ' + groupLog)
      // console.log('group log surname : ' + groupLog[0].student.surname)
      // get current user contribution
      // const contribution = await 
      // get contribution of all team members
      // const teamContributions = await

      return groupLog;
    }

    async supGroupCont(gid) {
        //get all students in the group
        return await this.table.getCompleteGroupLog(gid);
    }

  }
  
  module.exports = ContributionModel;