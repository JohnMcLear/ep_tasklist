var collectContentPre = function(hook, context){
  var cls = context.cls;
  var tname = context.tname;
  var state = context.state; 
  var lineAttributes = state.lineAttributes

  var tagIndex = cls.indexOf("tasklist-not-done");
  // console.log("tI1", tagIndex);
  if(tagIndex !== -1){
    lineAttributes['tasklist-not-done'] = tags[tagIndex];
  }

  var tagIndex = cls.indexOf("tasklist-done");
  // console.log("tI2", tagIndex);
  if(tagIndex !== -1){
    lineAttributes['tasklist-done'] = tags[tagIndex];
  }

  if(tname === "div" || tname === "p"){
    delete lineAttributes['tasklist-done'];
    delete lineAttributes['tasklist-not-done'];
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
