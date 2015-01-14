/*** 
*
* Most of the logic for task lists are done here
*
*/

if(typeof exports == 'undefined'){
  var exports = this['mymodule'] = {};
}

var underscore = require('ep_etherpad-lite/static/js/underscore');
var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
var tags = ['tasklist-not-done', 'tasklist-done'];
var padEditor;

exports.tasklist = {

  /***
  *
  *  Add button to the editbar and bind a listener
  *
  ***/

  init: function(context){ // Write the button to the dom
    var buttonHTML = '<li class="acl-write" id="tasklist"><a class="grouped-middle" data-l10n-id="pad.toolbar.tasklist.title" title="Task list Checkbox"><span class="buttonicon buttonicon-tasklist"></span></a></li>';
    $(buttonHTML).insertBefore($('.buttonicon-indent').parent().parent());
    $('#tasklist').click(function(){ // apply attribtes when we click the editbar button

      context.ace.callWithAce(function(ace){ // call the function to apply the attribute inside ACE
        ace.ace_doInsertTaskList();
      }, 'tasklist', true); // TODO what's the second attribute do here?
      padeditor.ace.focus();

    });
    context.ace.callWithAce(function(ace){
      var doc = ace.ace_getDocument();
      $(doc).find('#innerdocbody').on("click", underscore(exports.tasklist.doUpdateTaskList).bind(ace));
    }, 'tasklist', true);
  },


  /***
  *
  *  Toggle if some text is or aren't a task list
  *
  ***/

  doInsertTaskList: function(){
    var rep = this.rep;
    var documentAttributeManager = this.documentAttributeManager;
    if (!(rep.selStart && rep.selEnd)){ return; } // only continue if we have some caret position
    var firstLine = rep.selStart[0]; // Get the first line
    var lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0)); // Get the last line
    underscore(underscore.range(firstLine, lastLine + 1)).each(function(i){ // For each line, either turn on or off task list
      var istasklist = documentAttributeManager.getAttributeOnLine(i, 'tasklist-not-done');
      if(!istasklist){ // if its already a tasklist item
        documentAttributeManager.setAttributeOnLine(i, 'tasklist-not-done', 'tasklist-not-done'); // make the line a task list
      }else{
        documentAttributeManager.removeAttributeOnLine(i, 'tasklist-not-done'); // remove the task list from the line
      }
    });
  },


  /***
  *
  *  Toggle a task as done/not done -- called by ace_inner.js
  *
  ***/

  doToggleTaskListItem: function(lineNumber){
    var rep = this.rep;
    var documentAttributeManager = this.documentAttributeManager;
    var isDone = documentAttributeManager.getAttributeOnLine(lineNumber, 'tasklist-done');
    if(isDone){
      documentAttributeManager.removeAttributeOnLine(lineNumber, 'tasklist-done'); // remove the task list from the line
      documentAttributeManager.setAttributeOnLine(lineNumber, 'tasklist-not-done', 'tasklist-not-done'); // make it undone
    }else{
      documentAttributeManager.removeAttributeOnLine(lineNumber, 'tasklist-not-done'); // remove the task list from the line
      documentAttributeManager.setAttributeOnLine(lineNumber, 'tasklist-done', 'tasklist-done'); // make it done
    }

  },


  /***
  *
  *  Is it a task list item and has the checkbox been clicked?
  *
  ***/

  doUpdateTaskList: function(event){ // This is in the wrong context to access doc attr manager
    var ace = this;
    var target = event.target;
    var isTaskList = ($(target).hasClass("tasklist-not-done") || $(target).hasClass("tasklist-done"));
    var parent = $(target).parent();
    var lineNumber = parent.prevAll().length;
    var targetRight = event.target.offsetLeft + 14; // The right hand side of the checkbox -- remember the checkbox can be indented
    var isCheckbox = (event.pageX < targetRight); // was the click to the left of the checkbox
    if(!isTaskList || !isCheckbox){ return; } // Dont continue if we're not clicking a checkbox of a tasklist
    padEditor.callWithAce(function(ace){ // call the function to apply the attribute inside ACE
      ace.ace_doToggleTaskListItem(lineNumber);
    }, 'tasklist', true); // TODO what's the second attribute do here?
  }
}


/***
 * 
 *  Once ace is initialized, we bind the functions to the context
 * 
 ***/

function aceInitialized(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertTaskList = underscore(exports.tasklist.doInsertTaskList).bind(context); // What does underscore do here?
  editorInfo.ace_doToggleTaskListItem = underscore(exports.tasklist.doToggleTaskListItem).bind(context); // TODO
  padEditor = context.editorInfo.editor;
}


/***
 * 
 *  Add the Javascript to Ace inner head, this is for the onClick listener
 * 
 ***/
var aceDomLineProcessLineAttributes = function(name, context){
  if( context.cls.indexOf("tasklist-not-done") !== -1) { var type="tasklist-not-done"; }
  if( context.cls.indexOf("tasklist-done") !== -1)     { var type="tasklist-done";}
  var tagIndex = context.cls.indexOf(type);
  if (tagIndex !== undefined && type){
    var tag = tags[tagIndex];
    var modifier = {
      preHtml: '<li class="'+type+'"">',
      postHtml: '</li>',
      processedMarker: true
    };
    return [modifier]; // return the modifier
  }
  return []; // or return nothing
};


/***
 *
 * Turn attributes into classes
 *
 ***/
exports.aceAttribsToClasses = function(hook, context){if(context.key == 'tasklist-not-done' || context.key == 'tasklist-done'){return [context.value];}}


/***
 * 
 *  Export all the hooks
 * 
 ***/
exports.aceInitialized = aceInitialized;
exports.aceDomLineProcessLineAttributes = aceDomLineProcessLineAttributes;
exports.aceEditorCSS = function(hook_name, cb){return ["/ep_tasklist/static/css/tasklist.css"];} // inner pad CSS
exports.postAceInit = function(hook, context){exports.tasklist.init(context);

}
