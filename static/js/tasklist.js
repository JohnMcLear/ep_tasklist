var _, $, jQuery;
var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');

if(typeof exports == 'undefined'){
  var exports = this['mymodule'] = {};
}

function postAceInit(hook, context){
  exports.tasklist.init(context);
}

exports.aceEditorCSS = function(hook_name, cb){
  return ["/ep_tasklist/static/css/tasklist.css"];
}

exports.tasklist = {
  init: function(context){
    var buttonHTML = '<li class="acl-write" id="tasklist" data-key="tasklist"><a class="grouped-middle" data-l10n-id="pad.toolbar.tasklist.title" title="Task list Checkbox"><span class="buttonicon buttonicon-tasklist"></span></a></li>';
    $(buttonHTML).insertBefore('#indent');
    $('#tasklist').click(function(){
      exports.tasklist.onClick(context);
      exports.tasklist.onUpdate(context);
    });
  },
  onClick: function(context){
    context.ace.callWithAce(function(ace){
      ace.ace_doInsertChecklist();
    },'insertchecklist' , true);
  },
  onUpdate: function(context){
    $('.tasklist').click(function(){
      context.ace.callWithAce(function(ace){
        ace.ace_doUpdateChecklist();
      },'updatechecklist' , true);
    });
  }
}

// Find out which lines are selected and assign them the checklist attribute.
// Passing a level >= 0 will set a heading on the selected lines, level < 0
// will remove it
function doInsertChecklist(){
  var rep = this.rep;
  var documentAttributeManager = this.documentAttributeManager;
  var firstLine, lastLine;

  if (!(rep.selStart && rep.selEnd)){ return; } // only continue if we have some caret position

  firstLine = rep.selStart[0];
  lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0));

  _(_.range(firstLine, lastLine + 1)).each(function(i){
    top.console.log(documentAttributeManager);
    var isChecklist = documentAttributeManager.getAttributeOnLine(i, 'checklist');
    if(isChecklist == 'on'){ // if its already checked
      top.console.log("task uncompleted");
      documentAttributeManager.setAttributeOnLine(i, 'checklist', 'off');
    }else{
      top.console.log("task completed, go you"); // complete the item
      documentAttributeManager.removeAttributeOnLine(i, 'checklist', 'on');
    }
  });
}


// Find out which lines are selected and assign them the checklist attribute.
// Passing a level >= 0 will set a heading on the selected lines, level < 0 
// will remove it
function doInsertChecklist(){
  var rep = this.rep;
  var documentAttributeManager = this.documentAttributeManager;
  var firstLine, lastLine;

  if (!(rep.selStart && rep.selEnd)){ return; } // only continue if we have some caret position
  
  firstLine = rep.selStart[0];
  lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0));

  _(_.range(firstLine, lastLine + 1)).each(function(i){
    top.console.log(documentAttributeManager);
    var isChecklist = documentAttributeManager.getAttributeOnLine(i, 'checklist');
    top.console.log("attr", i, documentAttributeManager.getAttributeOnLine(i, 'checklist'));
    if(!isChecklist){ // if its already a checklist item
      top.console.log("task added");
      documentAttributeManager.setAttributeOnLine(i, 'checklist', 'on');
    }else{
      top.console.log("task removed!");
      documentAttributeManager.removeAttributeOnLine(i, 'checklist', 'on');
    }
  });
}

// All our tags are block elements, so we just return them.
var tags = ['checklist'];
var aceRegisterBlockElements = function(){
  return tags;
}

// Our heading attribute will result in a heaading:h1... :h6 class
function aceAttribsToClasses(hook, context){
  if(context.key == 'checklist'){
    return ['checklist:' + context.value ];
  }
}

// Once ace is initialized, we set ace_doInsertChecklist and bind it to the context
function aceInitialized(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertChecklist = _(doInsertChecklist).bind(context);
}


// Here we convert the class heading:h1 into a tag
var aceDomLineProcessLineAttributes = function(name, context){
  var cls = context.cls;
  var domline = context.domline;
  var checklistType = /(?:^| )checklist:([A-Za-z0-9]*)/.exec(cls);
  var tagIndex;
top.console.log("here!");
  
  if (checklistType) tagIndex = _.indexOf(tags, checklistType[1]);
  
  if (tagIndex !== undefined && tagIndex >= 0){
    
    var tag = tags[tagIndex];
    var modifier = {
      preHtml: '<' + tag + '>',
      postHtml: '</' + tag + '>',
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
exports.doInsertChecklist = doInsertChecklist;
