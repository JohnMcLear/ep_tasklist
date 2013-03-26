// This is a hack to get around ACEs brain-dead limit on onClick on
// links inside the ACE domlines...
// Borrowed from: https://github.com/redhog/ep_sketchspace/blob/master/static/js/ace_inner.js

$(document).ready(function () {
  $("body").mousedown(function (event) {
    parent.parent.exports.tasklist.doUpdateTaskList(1);
//    context.ace.callWithAce(function(ace){
//      ace.ace_doUpdatetasklist();
 
/*    if ($(event.target).filter(".tasklist").length > 0) { // if it's a tasklist item
      var classList = $(event.target).attr('class').split(/\s+/);
      $.each( classList, function(index, item){
        if (item === 'tasklist-done') {
          $(event.target).removeClass("tasklist-done"); // doesn't work cause it doesn't add a line attribute :|
          console.log("is already marked as completed so marking it as not done");
        }else{
          $(event.target).addClass("tasklist-done"); // doesn't work cause it doesn't add a line attribute :|
          console.log("already has tasklist so marking it as done");
        }
      });
    }
*/
//    });



  });
});

