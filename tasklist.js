var eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_scripts = function (hook_name, args, cb) {
  args.content = args.content + "<script src='../static/plugins/ep_tasklist/static/js/tasklist.js'></script>";
  return cb();
}

exports.eejsBlock_styles = function (hook_name, args, cb) {
  args.content = args.content + "<link href='../static/plugins/ep_tasklist/static/css/button.css' rel='stylesheet'>";
  return cb();
}

