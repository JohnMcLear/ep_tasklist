/*** 
*
* Most of the logic for task lists are done here
*
*/

if(typeof exports == 'undefined'){
  var exports = this['mymodule'] = {};
}

var _ = require('ep_etherpad-lite/static/js/underscore');
var tags = ['tasklist-not-done', 'tasklist-done'];

exports.tasklist = {

  /***
  *
  *  Add button to the editbar and bind a listener
  *
  ***/

  init: function(context){ // Write the button to the dom
    var buttonHTML = '<li class="acl-write" id="tasklist"><a class="grouped-middle" data-l10n-id="pad.toolbar.tasklist.title" title="Task list Checkbox"><span class="buttonicon buttonicon-tasklist"></span></a></li>';
    $(buttonHTML).insertBefore('#indent');
    $('#tasklist').click(function(){ // apply attribtes when we click it
      context.ace.callWithAce(function(ace){
        ace.ace_doInsertTaskList();
      }, 'tasklist', true); // TODO what's the second attribute do here?
    });
    context.ace.callWithAce(function(ace){
      var doc = ace.ace_getDocument();
      console.log(doc);
//      $(doc).find('#innerdocbody').on("click", _(this.doUpdateTaskList).bind(ace));
      $(doc).find('#innerdocbody').on("click", function(){alert("pow");});

    });
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
    _(_.range(firstLine, lastLine + 1)).each(function(i){ // For each line, either turn on or off task list
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

  doUpdateTaskList: function(){
    var documentAttributeManager = this.documentAttributeManager;
    console.log("dAM", documentAttributeManager);
    var line = 1;
    var istasklist = documentAttributeManager.getAttributeOnLine(line, 'tasklist-not-done'); // is it checked already?
    if(istasklist === 'tasklist-done'){ // if its already checked
      documentAttributeManager.setAttributeOnLine(line, 'tasklist-not-done', 'tasklist-not-done');
    }else{
      documentAttributeManager.setAttributeOnLine(line, 'tasklist-done', 'tasklist-done');
    }
  }
}


/***
 * 
 *  Once ace is initialized, we bind the functions to the context
 * 
 ***/

function aceInitialized(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertTaskList = _(exports.tasklist.doInsertTaskList).bind(context); // What does underscore do here?
  editorInfo.ace_doUpdateTaskList = _(exports.tasklist.doUpdateTaskList).bind(context); // TODO
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
 *  Add the Javascript to Ace inner head, this is for the onClick listener
 * 
 ***/
exports.aceInitInnerdocbodyHead = function(hook_name, args, cb) {
  args.iframeHTML.push('<script type="text/javascript" src="../static/plugins/ep_tasklist/static/js/ace_inner.js"></script>');
  return cb();
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
