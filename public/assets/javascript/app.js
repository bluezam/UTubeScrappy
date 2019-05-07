$(document).ready(function(){

  // Nav Bar Mobile Slider
  $(".button-collapse").sideNav();


  // the jquery below isn't entirely needed
  // only for "LOCATION.RELOAD" to hold the location when i make a post


  // Click Listener for FORM SUBMISSION to ADD a comment
  $('.add-comment-button').on('click', function(){

    // Get _id of comment to be deleted
    var videoId = $(this).data("id");

    // URL root (so it works in eith Local Host for Heroku)
    var baseURL = window.location.origin;

    // Get Form Data by Id
    var frmName = "form-add-" + videoId;
    var frm = $('#' + frmName);


    // AJAX Call to delete Comment
    $.ajax({
      url: baseURL + '/add/comment/' + videoId,
      type: 'POST',
      data: frm.serialize(),
    })
    .done(function() {
      // Refresh the Window after the call is done
      location.reload();
    });
    
    // Prevent Default
    return false;

  });


  // Click Listener for FORM SUBMISSION to DELETE a comment
  $('.delete-comment-button').on('click', function(){

    // Get _id of comment to be deleted
    var commentId = $(this).data("id");

    // URL root (so it works in eith Local Host for Heroku)
    var baseURL = window.location.origin;

    // AJAX Call to delete Comment
    $.ajax({
      url: baseURL + '/remove/comment/' + commentId,
      type: 'POST',
    })
    .done(function() {
      // Refresh the Window after the call is done
      location.reload();
    });
    
    // Prevent Default
    return false;

  });
  
});