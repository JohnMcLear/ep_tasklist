var _ = require('ep_etherpad-lite/static/js/underscore');

var tags = ['tasklist'];

var collectContentPre = function(hook, context){
top.console.log("uwuwua");
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(tags, tname);
top.console.log("hi", tagIndex);
  if(tagIndex >= 0){
    lineAttributes['tasklist'] = tags[tagIndex];
  }
};

var collectContentPost = function(hook, context){
top.console.log("uwuwua22");
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
