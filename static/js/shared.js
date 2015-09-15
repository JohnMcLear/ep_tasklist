var collectContentPre = function(hook, context){
  var cls = context.cls;
  var tname = context.tname;
  var state = context.state; 
  var lineAttributes = state.lineAttributes

  if(cls !== null) {
    var tagIndex = cls.indexOf("tasklist-not-done");
    if(tagIndex === 0){
      lineAttributes['tasklist-not-done'] = tags[tagIndex];
    }

    var tagIndex = cls.indexOf("tasklist-done");
    if(tagIndex !== -1){
      lineAttributes['tasklist-done'] = 'tasklist-done';
    }

    if(tname === "div" || tname === "p"){
      delete lineAttributes['tasklist-done'];
      delete lineAttributes['tasklist-not-done'];
    }
  }
};

var collectContentPost = function(hook, context){
  var cls = context.cls;
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes

  var tagIndex = cls.indexOf("tasklist-not-done");
  if(tagIndex >= 0){
    delete lineAttributes['tasklist-not-done'];
  }

  var tagIndex = cls.indexOf("tasklist-done");       
  if(tagIndex >= 0){
    delete lineAttributes['tasklist-done'];
  }
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
