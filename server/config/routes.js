'use strict';

var path = require('path'),
    auth = require('../config/auth');

module.exports = function(app) {
  // User Routes
  var users = require('../controllers/users');
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);

  app.post('/user/team', users.setTeam);

  // TODO: Add option to update username


  // Check if username is available
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', users.exists);

  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.delete('/auth/session', session.logout);

  // General entities
  var workspaces = require('../controllers/workspaces');
  app.get('/api/workspaces', workspaces.all);
  app.post('/api/workspaces', auth.ensureAuthenticated, workspaces.create);
  app.get('/api/workspaces/:workspaceId', workspaces.show);
  app.put('/api/workspaces/:workspaceId', auth.ensureAuthenticated, auth.workspace.hasAuthorization, workspaces.update);
  app.delete('/api/workspaces/:workspaceId', auth.ensureAuthenticated, auth.workspace.hasAuthorization, workspaces.destroy);

  var activities = require('../controllers/activities');
  app.get('/api/activities', activities.all);
  app.post('/api/activities', auth.ensureAuthenticated, activities.create);
  app.get('/api/activities/:activityId', activities.show);
  app.put('/api/activities/:activityId', auth.ensureAuthenticated, auth.activity.hasAuthorization, activities.update);
  app.delete('/api/activities/:activityId', auth.ensureAuthenticated, auth.activity.hasAuthorization, activities.destroy);

  var items = require('../controllers/items');
  app.get('/api/items', items.all);
  app.post('/api/items', auth.ensureAuthenticated, items.create);
  app.get('/api/items/:itemId', items.show);
  app.put('/api/items/:itemId', auth.ensureAuthenticated, auth.item.hasAuthorization, items.update);
  app.delete('/api/items/:itemId', auth.ensureAuthenticated, auth.item.hasAuthorization, items.destroy);

  // Trip Planner routes
  var trips = require('../controllers/tp/trips');
  app.get('/api/trips', trips.all);
  app.post('/api/trips', auth.ensureAuthenticated, trips.create);
  app.get('/api/trips/:tripId', trips.show);
  app.put('/api/trips/:tripId', auth.ensureAuthenticated, auth.trip.hasAuthorization, trips.update);
  app.delete('/api/trips/:tripId', auth.ensureAuthenticated, auth.trip.hasAuthorization, trips.destroy);


  // Project manager routes
  var projects = require('../controllers/projects');
  app.get('/api/projects', projects.all);
  app.post('/api/projects', auth.ensureAuthenticated, projects.create);
  app.get('/api/projects/:projectId', projects.show);
  app.put('/api/projects/:projectId', auth.ensureAuthenticated, auth.project.hasAuthorization, projects.update);
  app.delete('/api/projects/:projectId', auth.ensureAuthenticated, auth.project.hasAuthorization, projects.destroy);

  var tasks = require('../controllers/tasks');
  app.get('/api/tasks', tasks.all);
  app.post('/api/tasks', auth.ensureAuthenticated, tasks.create);
  app.get('/api/tasks/:taskId', tasks.show);
  app.put('/api/tasks/:taskId', auth.ensureAuthenticated, auth.task.hasAuthorization, tasks.update);
  app.delete('/api/tasks/:taskId', auth.ensureAuthenticated, auth.task.hasAuthorization, tasks.destroy);

  var teams = require('../controllers/teams');
  app.get('/api/teams', teams.all);
  app.post('/api/teams', auth.ensureAuthenticated, teams.create);
  app.get('/api/teams/:teamId', teams.show);
  app.put('/api/teams/:teamId', auth.ensureAuthenticated, auth.team.hasAuthorization, teams.update);
  app.delete('/api/teams/:teamId', auth.ensureAuthenticated, auth.team.hasAuthorization, teams.destroy);

  

  var team_invites = require('../controllers/team_invites');
  app.get('/api/team_invites', team_invites.all);
  app.post('/api/team_invites', auth.ensureAuthenticated, team_invites.create);
  app.get('/api/team_invites/:inviteId', team_invites.show);
  app.put('/api/team_invites/:inviteId', auth.ensureAuthenticated, auth.activity.hasAuthorization, team_invites.update);
  app.delete('/api/team_invites/:inviteId', auth.ensureAuthenticated, auth.activity.hasAuthorization, team_invites.destroy);
  app.get('/api/team_invites_for_email', team_invites.findByEmail);

  app.param('projectId', projects.load);
  app.param('teamId', teams.load);
  app.param('activityId', activities.load);
  app.param('inviteId', team_invites.load);

  // Angular Routes
  app.get('/partials/*', function(req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
  });

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }

    res.render('index.html');
  });

}