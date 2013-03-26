var collectContentPre = function(hook, context){
  var tname = context.cls;
  var state = context.state; 
  var lineAttributes = state.lineAttributes

  var tagIndex = tname.indexOf("tasklist-not-done");
  if(tagIndex !== -1){
    lineAttributes['tasklist-not-done'] = tags[tagIndex];
  }

  var tagIndex = tname.indexOf("tasklist-done");
  if(tagIndex !== -1){
    lineAttributes['tasklist-done'] = tags[tagIndex];
  }
};

var collectContentPost = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes

  var tagIndex = tname.indexOf("tasklist-not-done");
  if(tagIndex >= 0){
    delete lineAttributes['tasklist-not-done'];
  }

  var tagIndex = tname.indexOf("tasklist-done");       
  if(tagIndex >= 0){
    delete lineAttributes['tasklist-done'];
  }
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
