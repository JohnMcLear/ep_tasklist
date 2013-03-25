var collectContentPre = function(hook, context){
  var tname = context.cls;
  var state = context.state;
  var lineAttributes = state.lineAttributes

  if( (tname.indexOf("tasklist") !== -1) && (tname.indexOf("tasklist-done") === -1)){
    var tagIndex = tname.indexOf("tasklist");
    lineAttributes['tasklist'] = tags[tagIndex];
  }
  else if( tname.indexOf("tasklist-done") !== -1){
    var tagIndex = tname.indexOf("tasklist-done");
    lineAttributes['tasklist-done'] = tags[tagIndex];
  }
};

var collectContentPost = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(tags, tname);
  if(tagIndex >= 0){
    delete lineAttributes['tasklist'];
  }
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
