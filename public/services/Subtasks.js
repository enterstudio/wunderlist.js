'use strict';

/**
  * Provides methods for easy access to subtasks data.
  * @module services/Subtasks
  * @extends module:services/AuthenticatedService
  * @requires module:services/AuthenticatedService

* @example <caption>Create an instance of the Subtasks service</caption>
    var SubtasksService = require('services/Subtasks');
    var subtasks = new SubtasksService();

  * @example <caption>Get all uncompleted subtasks for a list</caption>
    var listID = 666;
    subtasks.forList(listID)
      .done(function (subtasksData, statusCode) {
        // ...
      })
      .fail(function (resp, code) {
        // ...
      });

  * @example <caption>Get completed subtasks for a list</caption>
    var listID = 3456
    var completed = true;
    subtasks.forList(listID, completed)
      .done(function (subtasksData, statusCode) {
        // ...
      })
      .fail(function (resp, code) {
        // ...
      });

  * @example <caption>Get all uncompleted subtasks for a task</caption>
    var taskID = 666;
    subtasks.forTask(taskID)
      .done(function (subtasksData, statusCode) {
        // ...
      })
      .fail(function (resp, code) {
        // ...
      });

  * @example <caption>Get completed subtasks for a task</caption>
    var taskID = 3456
    var completed = true;
    subtasks.forTask(taskID, completed)
      .done(function (subtasksData, statusCode) {
        // ...
      })
      .fail(function (resp, code) {
        // ...
      });

  * @example <caption>Get a specific subtask</caption>
    vat subtaskID = 777;
    subtasks.getID(subtaskID)
      .done(function (subtaskData, statusCode) {
        // ...
      })
      .fail(function (resp, code) {
        // ...
      });

  * @example <caption>Create a subtask</caption>
    subtasks.create({
      'task_id': 8675309
      'title': 'Call Jenny'
    })
    .done(function (subtaskData, statusCode) {
      // ...
    })
    .fail(function (resp, code) {
      // ...
    });

  * @example <caption>Update a subtask</caption>
    var subtaskID = 777;
    var subtaskRevision = 5;
    var updateData = {
      'title': 'Change the world'
    };
    subtasks.update(subtaskID, subtaskRevision, updateData)
      .done(function (subtaskData, statusCode) {
        // ...
      })
      .fail(function (resp, code) {
        // ...
      });

  * @example <caption>Delete a subtask</caption>
    var subtaskID = 777;
    var subtaskRevision = 5;
    subtasks.deleteID(subtaskID, subtaskRevision)
      .always(function (resp, code) {
        // ...
      });
  */

var core = require('wunderbits.core');
var assert = core.lib.assert;
var WBDeferred = core.WBDeferred;
var MagiConsole = require('magiconsole');
var localConsole = new MagiConsole('SDK:SERVICE:SUBTASKS');

var AuthenticatedService = require('./AuthenticatedService');

var _super = AuthenticatedService.prototype;
module.exports = AuthenticatedService.extend({

  'baseUrl': '/subtasks',

  'type': 'subtask',

   /**
    * Create a subtask.
    * @param {object} data - Subtask creation data.
    * @param {integer} data.task_id - Task ID which subtask belongs to.
    * @param {string} data.title - Subtask title. Maximum length is 255 characters.
    * @param {boolean} [data.completed] - Is subtask completed?
    * @param {string} [requestID] - User supplied Request ID. Autogenerated if not supplied.
    * @returns {promise} Promise of request deferred.
    */
  'create': function (data) {

    var self = this;
    try {
      self.validateCreateData(data);
    }
    catch (e) {
      localConsole.error(e);
      return new WBDeferred().reject({
        'errors': [e.toString()]
      }, 0).promise();
    }

    var request = _super.create.apply(self, arguments);
    return request.promise();
  },

  /**
    * Allows fetching either all or just uncompleted subtasks for a list.
    * @param {string} listId - The list to fetch.
    * @param {boolean} [completed] - Fetch for completed tasks when TRUE
    * @param {string} [requestID] - User supplied Request ID. Autogenerated if not supplied.
    */
  'forList': function (listId, completed, requestID) {

    var self = this;

    var request = self.get(self.baseUrl, {
      'list_id': listId,
      'completed_tasks': !!completed
    }, requestID);

    return request.promise();
  },

  /**
    * Validates subtask creation data.
    * @param {object} data - Subtask data.
    */
  'validateCreateData': function (data) {

    data = data || {};

    var hasData = Object.keys(data).length;
    var required = ' required for subtask creation';
    assert(hasData, 'data' + required);
    assert.number(data.task_id, 'data.task_id' + required);
    assert.string(data.title, 'data.title' + required);
  }
});
