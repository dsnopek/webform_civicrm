function web_civi_select_reset(op, id) {
    id = "#js-select-" + id;
  switch (op) {
    case 'reset':
      $(id).parent().find('input:checkbox').each(function() {
        $(this).attr('checked', $(this).attr('defaultChecked'));
      });
      break;
    default:
      $(id).parent().find('input:checkbox').attr('checked', op);
  }
}

function webform_civicrm_relationship_options() {
  var contacts = $('#edit-number-of-contacts').val();
  if (contacts > 1) {
    var types = new Object();
    for (var i=1; i<=contacts; i++) {
      var sub_type = $('#edit-civicrm-'+i+'-contact-1-contact-contact-sub-type').val();
      if (sub_type == 0 || sub_type == 'create_civicrm_webform_element') {
        sub_type = null;
      }
      types[i] = {
        type: $('#edit-'+i+'-contact-type').val(),
        sub_type: sub_type,
      };
    }
    $('select[id$=relationship-relationship-type-id]').each(function(){
      var selected_option = $(this).val();
      var id = $(this).attr('id').split('-');
      var contact_a = types[id[2]];
      var contact_b = types[id[4]];
      $(this).find('option').not('[value="0"],[value="create_civicrm_webform_element"]').remove();
      for (var i in webform_civicrm_relationship_data) {
        var t = webform_civicrm_relationship_data[i];
        if ((t['type_a'] == contact_a['type'] || !t['type_a'])
          && (t['type_b'] == contact_b['type'] || !t['type_b'])
          && (t['sub_type_a'] == contact_a['sub_type'] || !t['sub_type_a'])
          && (t['sub_type_b'] == contact_b['sub_type'] || !t['sub_type_b'])
        ) {
          $(this).append('<option value="'+t['id']+'_a">'+t['label_a_b']+'</option>');
        }
        if ((t['type_a'] == contact_b['type'] || !t['type_a'])
          && (t['type_b'] == contact_a['type'] || !t['type_b'])
          && (t['sub_type_a'] == contact_b['sub_type'] || !t['sub_type_a'])
          && (t['sub_type_b'] == contact_a['sub_type'] || !t['sub_type_b'])
          && (t['name_a_b'] !== t['name_b_a'])
        ) {
          $(this).append('<option value="'+t['id']+'_b">'+t['label_b_a']+'</option>');
        }
      }
      if ($(this).find('option[value='+selected_option+']').size()) {
        $(this).val(selected_option);
      }
      else {
        $(this).val("0");
      }
    });
  }
}

function webform_civicrm_contact_match_checkbox(){
  if($('#edit-1-contact-type').val() == 'individual') {
    $('#civi-contact-match-on').show();
    $('#civi-contact-match-off').hide();
    $('#edit-contact-matching').removeAttr('disabled');
  }
  else {
    $('#civi-contact-match-on').hide();
    $('#civi-contact-match-off').show();
    $('#edit-contact-matching').attr('disabled', 'disabled');
  }
}

$(document).ready( function(){
  if(!$('#edit-nid').is(':checked')){
    $('#webform-civicrm-configure-form fieldset > div, #webform-civicrm-configure-form fieldset > fieldset, #edit-number-of-contacts-wrapper').not('.hidden').hide();
  }

  webform_civicrm_contact_match_checkbox();

  $('#edit-nid').change(function(){
    if( $(this).is(':checked') ){
      $('#webform-civicrm-configure-form fieldset > div, #webform-civicrm-configure-form fieldset > fieldset, #edit-number-of-contacts-wrapper').not('.hidden').show(600);
    }else{
      $('#webform-civicrm-configure-form fieldset > div, #webform-civicrm-configure-form fieldset > fieldset, #edit-number-of-contacts-wrapper').not('.hidden').hide(600);
    }
  });

  $('#edit-toggle-message').change(function(){
    if( $(this).is(':checked')){
      $('#edit-message').removeAttr('disabled');
      $('#edit-message-wrapper').show(600).removeClass('hidden');
    }else{
      $('#edit-message').attr('disabled','disabled');
      $('#edit-message-wrapper').hide().addClass('hidden');
    }
  }).change();

  $('#edit-number-of-contacts').change(function(){
    $('#webform-civicrm-configure-form')[0].submit();
  });

  $('select[id*=contact-type], select[id*=contact-sub-type]').change(function(){
    webform_civicrm_relationship_options();
  });

  $('#edit-1-contact-type').change(function(){
    webform_civicrm_contact_match_checkbox();
  });

  // D6 Can't handle dynamically generated ahah elements, so just refresh the form
  if ($('#edit-activity-type-id').val() == 0) {
    $('#edit-activity-type-id').unbind('change');
    $('#edit-activity-type-id').change(function(){
      $('#webform-civicrm-configure-form')[0].submit();
    });
  }

});
