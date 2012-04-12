// An example of end split process rendering.
// Overridable by a custom method
splitDone = function(data) {

  if(data.application_error){
    $('#dialog-message').updateDialog({
      title: 'An error occurred',
      text: data.application_error,
      buttons: {
        Ok: function() {
          $(this).dialog('close')
        }
      }
    })
    return false;
  }

  list = $("#media_output .accordion.buttons.scrollable");
  count = list.children('h3').length;
  // Insert valid splitted files in Output file box
  list.prepend(data.new_items);

  $('h3', list).unbind('mouseleave').unbind('mouseenter');
  list.accordion('destroy');
  list.scrollable('destroy');
  $('button', list).button('destroy').unbind('click');
  list.setUp();

  $('h3:lt('+ data.successful.length +')', list).effect('pulsate', {}, 500).addClass('ui-state-hover');

  report  = (data.successful.length  > 0 ? '<p>File splitted:<br /><strong>' + data.successful.join('<br />') + '</strong></p>' : '');
  report += (data.errors.length > 0 ? '<p>Errors:<br /><strong>' + data.errors.join('<br />') + '</strong></p>' : '')

  $('#dialog-message').updateDialog({
    title: 'Splitting report',
    text: report,
    buttons: {
      Ok: function() {
        $(this).dialog('close')
      }
    }
  })
}