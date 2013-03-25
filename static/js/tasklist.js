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
exports.postAceInit = function(hook, context){exports.tasklist.init(context);
 console.log("clontext", context);

} // initiate the task list
exports.aceEditorCSS = function(hook_name, cb){return ["/ep_tasklist/static/css/tasklist.css"];} // inner pad CSS

exports.aceAttribsToClasses = function(hook, context){ 
  console.log("context.key", context.key);
  if(context.key == 'tasklist' || context.key == 'tasklist-done'){return [context.value];} 
} // Our heading attribute will result in 'tasklist' or 'tasklist-done'

exports.tasklist = {
  init: function(context){ // Write the button to the dom
    var buttonHTML = '<li class="acl-write" id="tasklist" data-key="tasklist"><a class="grouped-middle" data-l10n-id="pad.toolbar.tasklist.title" title="Task list Checkbox"><span class="buttonicon buttonicon-tasklist"></span></a></li>';
    $(buttonHTML).insertBefore('#indent');
    $('#tasklist').click(function(){
      exports.tasklist.onClick(context);
    });
    // exports.tasklist.onUpdate(context); // Supposed to make the checklist UL items clickable but doesnt work
  },
  onClick: function(context){ // On click the checklist editbar button
    context.ace.callWithAce(function(ace){
      ace.ace_doInserttasklist();
//      ace.ace_doUpdatetasklist();
    },'inserttasklist' , true);
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
      documentAttributeManager.setAttributeOnLine(i, 'tasklist', 'tasklist');
    }else{
      documentAttributeManager.removeAttributeOnLine(i, 'tasklist');
    }
  });
}

// Update an existing task as completed / uncompleted
function doUpdatetasklist(){
  if (!(rep.selStart && rep.selEnd)){ return; } // only continue if we have some caret position

  firstLine = rep.selStart[0];
  lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0));

  _(_.range(firstLine, lastLine + 1)).each(function(i){
    var istasklist = documentAttributeManager.getAttributeOnLine(i, 'tasklist');
    if(istasklist === 'tasklist-done'){ // if its already checked
      documentAttributeManager.setAttributeOnLine(i, 'tasklist', 'tasklist');
    }else{
      documentAttributeManager.setAttributeOnLine(i, 'tasklist', 'tasklist-done');
    }
  });
}

// Once ace is initialized, we set ace_doInserttasklist and bind it to the context
function aceInitialized(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInserttasklist = _(doInserttasklist).bind(context);
  editorInfo.ace_doUpdatetasklist = _(doUpdatetasklist).bind(context);
}


// Here we convert the class heading:h1 into a tag
var aceDomLineProcessLineAttributes = function(name, context){
  console.log("cls", context);
  var cls = context.cls;
  var domline = context.domline;
  if( (cls.indexOf("tasklist") !== -1) && (cls.indexOf("tasklist-done") === -1) ){ var type="tasklist"; }
  if( cls.indexOf("tasklist-done") !== -1){ var type="tasklist-done";}
  console.log("type", type);
  var tagIndex = cls.indexOf(type);
  if (tagIndex !== undefined && type){
    var tag = tags[tagIndex];
    var modifier = {
      preHtml: '<li class="'+type+'"">',
      postHtml: '</li>',
      processedMarker: true
    };
    return [modifier];
  }
  return [];
};

/**
 *
 * This hook inserts a bunch of Javascripts and CSS links into the editor iframe. They are used for styling of and making the im$
 */
exports.aceInitInnerdocbodyHead = function(hook_name, args, cb) {
  // FIXME: relative paths
  args.iframeHTML.push('<script type="text/javascript" src="/static/plugins/ep_tasklist/static/js/ace_inner.js"></script>');
  return cb();
};

// Export all hooks
exports.aceRegisterBlockElements = aceRegisterBlockElements;
exports.aceInitialized = aceInitialized;
exports.aceDomLineProcessLineAttributes = aceDomLineProcessLineAttributes;
exports.doInserttasklist = doInserttasklist;
exports.doUpdatetasklist = doUpdatetasklist;
