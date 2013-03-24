var _ = require('ep_etherpad-lite/static/js/underscore');

var tags = ['tasklist', 'tasklist-done'];

var collectContentPre = function(hook, context){
  var tname = context.cls;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(tags, tname);
  if(tagIndex >= 0){
    lineAttributes['tasklist'] = tags[tagIndex];
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
