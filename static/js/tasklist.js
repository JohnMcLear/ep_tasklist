if(typeof exports == 'undefined'){
  var exports = this['mymodule'] = {};
}

exports.postAceInit = function(hook, context){
  exports.tasklist.init();
}

exports.aceEditorCSS = function(hook_name, cb){
  return ["/ep_tasklist/static/css/tasklist.css"];
}

exports.tasklist = {
  init: function(){
    var buttonHTML = '<li class="acl-write" id="tasklist" data-key="tasklist"><a class="grouped-middle" data-l10n-id="pad.toolbar.tasklist.title" title="Task list Checkbox"><span class="buttonicon buttonicon-tasklist"></span></a></li>';
    $(buttonHTML).insertBefore('#indent');
    $('#tasklist').click(function(){
      exports.tasklist.onClick();
    });
  },
  onClick: function(){
    alert("Dang");
  }
}
