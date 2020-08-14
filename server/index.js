/////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Start NodeJS Config ////////////////////////////////

// Import downloaded packages from node_modules 
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
// Need to explicitely 'require' handlebars - not needed for PUG because PUG is built into Express
const Handlebars = require( 'handlebars');
const hbs = require( 'express-handlebars');
const multer = require('multer');

// Import our config from ./config folder. This is used to configure parameters such as database connection details
// Note: only the directory name is specified, so the actual file imported is 'index.js' (that's why we have loads of index.js files everywhere)
const configs = require('./config');

// create an express webserver object and store in app variable
const app = express();

// create a config variable based on environment (either development or production)
// look in ./server/config/index.js for details of the config
const config = configs[app.get('env')];

// create a sequalize variable using the PostgreSQL config and connect to database
// store the sequelize connection in our config for use later
const sequelize = new Sequelize(config.postgres.options);
sequelize
  .authenticate()
  .then(() => {
    console.info('Successfully connected to postgreSQL');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
config.postgres.client = sequelize;

// Import MVC Model Classes
const SupervisorModel = require('./models/logicModels/SupervisorModel');
const ProjectGroupModel = require('./models/logicModels/ProjectGroupModel');
const StudentModel = require('./models/logicModels/StudentModel');
const ClientModel = require('./models/logicModels/ClientModel');
const ModuleLeaderModel = require('./models/logicModels/moduleLeaderModel');
const UserModel = require('./models/logicModels/UserModel');
const AssignmentModel = require('./models/logicModels/AssignmentModel');
const ProjectModel = require('./models/logicModels/ProjectModel');
const ProjectProposalModel = require('./models/logicModels/ProjectProposalModel');
const ProposalReviewModel = require('./models/logicModels/ProposalReviewModel');
const MessagesModel = require('./models/logicModels/MessagesModel');
const ContributionModel = require('./models/logicModels/ContributionModel');
// const StudentFileModel = require('./models/logicModels/StudentFileModel');
const SubmissionModel = require('./models/logicModels/SubmissionModel');

// Import database services (these contain the MVC Model code that accesses the database)
const ProjectGroupsSQL = require('./models/schemaSQL/projectGroupsSQL');
const StudentsSQL = require('./models/schemaSQL/studentsSQL');
const ClientsSQL = require('./models/schemaSQL/clientsSQL');
const ModuleLeadersSQL = require('./models/schemaSQL/moduleLeadersSQL');
const SupervisorSQL = require('./models/schemaSQL/supervisorSQL');
const UsersSQL = require('./models/schemaSQL/usersSQL');
const AssignmentsSQL = require('./models/schemaSQL/AssignmentsSQL');
const ProjectsSQL = require('./models/schemaSQL/projectsSQL');
const ProjectProposalsSQL = require('./models/schemaSQL/projectProposalsSQL');
const ProposalReviewsSQL = require('./models/schemaSQL/proposalReviewsSQL');
const MessagesSQL = require('./models/schemaSQL/messagesSQL');
const ContributionSQL = require('./models/schemaSQL/contributionSQL');
// const StudentFileSQL = require('./models/schemaSQL/StudentFileSQL');
const SubmissionsSQL = require('./models/schemaSQL/SubmissionsSQL');

// create database tables
const Models = require('./models/schema');
const models = Models(config.postgres.client)

const projectGroupsSQL = ProjectGroupsSQL(models, config.postgres.client);
const studentsSQL = StudentsSQL(models, config.postgres.client);
const clientsSQL = ClientsSQL(models, config.postgres.client);
const moduleLeadersSQL = ModuleLeadersSQL(models, config.postgres.client);
const supervisorSQL = SupervisorSQL(models, config.postgres.client);
const usersSQL = UsersSQL(models, config.postgres.client);
const assignmentsSQL = AssignmentsSQL(models, config.postgres.client);
const projectsSQL = ProjectsSQL(models, config.postgres.client);
const projectProposalsSQL = ProjectProposalsSQL(models, config.postgres.client);
const proposalReviewsSQL = ProposalReviewsSQL(models, config.postgres.client);
const messagesSQL = MessagesSQL(models, config.postgres.client);
const contributionSQL = ContributionSQL(models, config.postgres.client);
// const studentfileSQL = StudentFileSQL(models, config.postgres.client);
const submissionsSQL = SubmissionsSQL(models, config.postgres.client);

// create instances in our Model Classes
const projectGroups = new ProjectGroupModel(projectGroupsSQL);
const students = new StudentModel(studentsSQL);
const clients = new ClientModel(clientsSQL);
const moduleLeaders = new ModuleLeaderModel(moduleLeadersSQL);
const supervisors = new SupervisorModel(supervisorSQL);
const users = new UserModel(usersSQL);
const assignments = new AssignmentModel(assignmentsSQL);
const projects = new ProjectModel(projectsSQL);
const projectProposals = new ProjectProposalModel(projectProposalsSQL);
const proposalReviews = new ProposalReviewModel(proposalReviewsSQL);
const messages = new MessagesModel(messagesSQL);
const contribution = new ContributionModel(contributionSQL);
// const studentfiles = new StudentFileModel(studentfileSQL);
const submissions = new SubmissionModel(submissionsSQL);

//////////////// Start Express Webserver Config ////////////////

//// Configure MVC Views ////

// Tell Express we are going to also use Handlebars for HTML Templates
// set extendion as .hbs as default is .handlebars
// app.engine('hbs', hbs({extname: 'hbs', defaultView: 'default',}));
// app.engine('hbs', hbs({extname: 'hbs', helpers: require("../public/js/helpers.js").helpers}));
// app.engine('hbs', hbs({extname: 'hbs'}));
app.engine('hbs', hbs({ 
  extname: 'hbs', 
  defaultLayout: 'base', 
  layoutsDir: __dirname + '/views/layout/',
  partialsDir: __dirname + '/views/partials/'
}));

app.set('view engine', 'hbs');

// Import generic helper code used in templates
require('./views/helpers/if_compare');
require('./views/helpers/setVar');
require('./views/helpers/checkIf');

// Tell Express to keep generated HTML nice and pretty (with blank lines instead of one long blob of HTML) in development
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

// Tell Express where to find HTML Templates
app.set('views', path.join(__dirname, './views'));

// Set the site title based on the chosen config sitename
app.locals.title = config.sitename;

//// Configure MVC Controllers ////

// The Controller and URL mapping config is done using 'routes'
//  the express webserver 'app' evaluates all app.use() before evaluating app.get(), app.post() etc.
//  app.use() will match any type of message. app.get() only matches GET, app.post() matches POST etc.
//  express webserver will evaluate app.use(), app.get(), app.post() until one returns a result and then
//  processing stops. To continue processing the app.whatever() just has to return next()

// Create Controller routes variable 'routes' with all of the GET, POST, DELETE, PUT Routes from Routes Folder
//  this is where to find MVC Controller Logic. Routes are not actually configured used until "app.use('/', routes(" command below so all 
//  of the app.whatever() rules below are evaluated before the controller routes
const routes = require('./routes');

// Set up further generic config using app.use 
// note: the rules below implicitely return next() so processing continues
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// refence from https://www.codementor.io/mayowa.a/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3?fbclid=IwAR2Np-O5u5CBqM8lhbqOCcrjzB7s2KkUPBPN2peXyXnBno1Z3e5GaXxRMm0
// set morgan to log info about our requests for development use.
app.use(morgan('short'));
// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: 'geIzrFUYMP5gLmRs42St82x4fpQrHMKK6qVWpyb4pNlnU71keshcxLjdI7WJVLG',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));
// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
console.log("1");
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    console.log("1.1");
    res.clearCookie('user_sid');        
  }
  next();
});

// end reference ======

// We don't have a favicon for browser tab so return a 204 message
// app.whaterer() typically has two parameters
//    - path (i.e. /favicon.ico) = path from the URL to match with
//    - a list with 3 variables
//        req = the incomming request from the browser, including headers and body
//        res = the response that is being built up by the app.whatever() functions
//        next = the next function after this one, but it's up to this app.whatever() to call it
// note: the next() function isn't called so we stop here if the browser calls for /favicon.ico
app.get('/favicon.ico', (req, res, next) => {
    return res.sendStatus(204);
});

// All of the MVC Controller app.get() and app.post() entries for all paths are now loaded
// the routes() method is passed a list of variables to the they can be extracted from the params
// variable that can be found in the routes() export method
app.use('/', routes({
    students,
    projectGroups,
    clients,
    moduleLeaders,
    supervisors,
    users,
    assignments,
    projects,
    projectProposals,
    proposalReviews,
    messages,
    contribution,
    // studentfiles,
    submissions,
}));

// If we get here something bad has happened i.e. some sort of error
// a 404 error is created, but the next() function is also used to actually process the error
app.use((req, res, next) => {
    return next(createError(404, 'File not found'));
});

// function will return an generated error
// note the fourth argument in the list - the error details
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    const status = err.status || 500;
    res.locals.status = status;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(status);
    return res.render('error', {
      user: req.session.user
    });
});

//////////////// Start Express Webserver Listening on Port 3000 ////////////////
app.listen(3000);

// Finally export the express server 'app' variable in case any process imports this file 
//  using require() method. This will probably not happen, but is good practice to include in all JS files
module.export = app;