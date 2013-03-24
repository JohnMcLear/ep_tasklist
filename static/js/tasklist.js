/*
* I borrow a lot of this from https://github.com/fourplusone/etherpad-plugins/tree/master/ep_headings
*
* TODO
* Make it so clicking on a checkbox updates the class
* When you write on a checkbox at the moment it loses it's styling
* Make sure if you click the bullet button when on a checkbox things don't get too crazy
*/

if(typeof exports == 'undefined'){
  var exports = this['mymodule'] = {};
}

var _, $, jQuery;
var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var tags = ['tasklist', 'tasklist-done'];
var aceRegisterBlockElements = function(){return tags;}


function postAceInit(hook, context){
  exports.tasklist.init(context);
}

exports.aceEditorCSS = function(hook_name, cb){
  return ["/ep_tasklist/static/css/tasklist.css"];
}

exports.tasklist = {
  init: function(context){ // Writ ethe button to the dom
    var buttonHTML = '<li class="acl-write" id="tasklist" data-key="tasklist"><a class="grouped-middle" data-l10n-id="pad.toolbar.tasklist.title" title="Task list Checkbox"><span class="buttonicon buttonicon-tasklist"></span></a></li>';
    $(buttonHTML).insertBefore('#indent');
    $('#tasklist').click(function(){
      exports.tasklist.onClick(context);
    });
    exports.tasklist.onUpdate(context); // Supposed to make the checklist UL items clickable but doesnt work
  },
  onClick: function(context){ // On click the checklist editbar button
    context.ace.callWithAce(function(ace){
      ace.ace_doInserttasklist();
    },'inserttasklist' , true);
  },
  onUpdate: function(context){ // doesnt work
//    top.console.log("BELOW DOESNT WORK"); // TODO

    $('#innerdocbody').on('click', '.tasklist', function() {
      alert( "foo" );
    });

    $('.tasklist').click(function(){
//      top.console.log("I dont work");
      context.ace.callWithAce(function(ace){
        ace.ace_doUpdatetasklist();
      },'updatetasklist' , true);
    });
  }
}

// Insert an existing task
function doInserttasklist(){
  var rep = this.rep;
  var documentAttributeManager = this.documentAttributeManager;
  var firstLine, lastLine;

  if (!(rep.selStart && rep.selEnd)){ return; } // only continue if we have some caret position

  firstLine = rep.selStart[0];
  lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0));

  _(_.range(firstLine, lastLine + 1)).each(function(i){
    var istasklist = documentAttributeManager.getAttributeOnLine(i, 'tasklist');
    if(!istasklist){ // if its already a tasklist item
      documentAttributeManager.setAttributeOnLine(i, 'tasklist', 'unfinished');
    }else{
      documentAttributeManager.removeAttributeOnLine(i, 'tasklist');
    }
  });
}

// Update an existing task as completed / uncompleted
function doUpdatetasklist(){
  var rep = this.rep;
  var documentAttributeManager = this.documentAttributeManager;
  var firstLine, lastLine;

  if (!(rep.selStart && rep.selEnd)){ return; } // only continue if we have some caret position

  firstLine = rep.selStart[0];
  lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0));

  _(_.range(firstLine, lastLine + 1)).each(function(i){
    var istasklist = documentAttributeManager.getAttributeOnLine(i, 'tasklist');
    if(istasklist == 'on'){ // if its already checked
      documentAttributeManager.setAttributeOnLine(i, 'tasklist', 'unfinished');
    }else{
      documentAttributeManager.removeAttributeOnLine(i, 'tasklist', 'done');
    }
  });
}

// Our heading attribute will result in a heaading:h1... :h6 class
function aceAttribsToClasses(hook, context){
  // console.log("context value", context.value);
  if(context.key == 'tasklist'){
    return ['tasklist', 'tasklist-done'];
  }
}

// Once ace is initialized, we set ace_doInserttasklist and bind it to the context
function aceInitialized(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInserttasklist = _(doInserttasklist).bind(context);
  editorInfo.ace_doUpdatetasklist = _(doUpdatetasklist).bind(context);
}


// Here we convert the class heading:h1 into a tag
var aceDomLineProcessLineAttributes = function(name, context){
  var cls = context.cls;
  var domline = context.domline;
  var tagIndex = cls.indexOf("tasklist");
  if (tagIndex !== undefined && tagIndex >= 0){
    if ( cls.indexOf("tasklistdone") !== -1){ 
      var type = "tasklist-done" } 
    else {
      var type = "tasklist";
    }
    var tag = tags[tagIndex];
    var modifier = {
      preHtml: '<ul class="'+type+'"><li>',
      postHtml: '</li></ul>',
      processedMarker: true
    };
    return [modifier];
  }
  return [];
};

// Export all hooks
exports.aceRegisterBlockElements = aceRegisterBlockElements;
exports.aceInitialized = aceInitialized;
exports.postAceInit = postAceInit;
exports.aceDomLineProcessLineAttributes = aceDomLineProcessLineAttributes;
exports.aceAttribsToClasses = aceAttribsToClasses;
exports.doInserttasklist = doInserttasklist;
exports.doUpdatetasklist = doUpdatetasklist;
