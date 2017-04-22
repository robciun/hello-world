var userListData = [];

$(document).ready(function() {
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

  $('#btnAddUser').on('click', addUser);

  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

  $('#userList table tbody').on('click', 'td a.linkupdateuser', changeUserInfo);

  $('#btnCancelUpdateUser').on('click', togglePanels);

  $('#updateUser input').on('change', function(){$(this).addClass('updated')})

  $('#btnUpdateUser').on('click', updateUser);

  //$('#btnCheckAnswer').on('click', checkUser);

  populateTable();
});

function populateTable() {
  var tableContent = '';

  $.getJSON( '/users/userlist', function( data ) {

    userListData = data;

    $.each(data, function(){
      tableContent += '<tr>';
	  tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.lecturerName + '" title="Show Details">' + this.lecturerName + '</a></td>';
	  tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">ištrinti</a>/<a href="#" class="linkupdateuser" rel="' + this._id + '">atnaujinti</a></td>';
	  tableContent += '</tr>';
    });

    $('#userList table tbody').html(tableContent);
  });
};

function showUserInfo(event) {

  event.preventDefault();

  var thisUserName = $(this).attr('rel');

  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.lecturerName; }).indexOf(thisUserName);

  var thisUserObject = userListData[arrayPosition];

  $('#lecturerName').text(thisUserObject.lecturerName);
  $('#programmingLanguage').text(thisUserObject.programmingLanguage);
  $('#level').text(thisUserObject.level);
  $('#task').text(thisUserObject.task);
  $('#answer').text(thisUserObject.answer);

};

function addUser(event) {
  event.preventDefault();

  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  if(errorCount === 0) {

    var newUser = {
      'lecturerName': $('#addUser fieldset input#inputLecturerName').val(),
      'programmingLanguage': $('#addUser fieldset input#inputProgrammingLanguage').val(),
      'level': $('#addUser fieldset input#inputLevel').val(),
      'task': $('#addUser fieldset input#inputTask').val(),
	  'answer': $('#addUser fieldset input#inputAnswer').val()
    }

    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function( response ) {

      if (response.msg === '') {

        $('#addUser fieldset input').val('');

        populateTable();
      }
      else {

        alert('Error: ' + response.msg);
      }
    });
  }
  else {
    alert('Please fill in all fields');
    return false;
  }
};


/*function checkUserInfo(event){
	event.preventDefault();

	var _id = $(this).attr('rel');
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(_id);

    var thisUserObject = userListData[arrayPosition];

	$('#checkUserAnswer').val(thisUserObject.answer);

	$('#checkUser').attr('rel', thisUserObject._id);
};

function checkUser(event){
	event.preventDefault();

	//var confirmation = confirm('Ar tai jūsų galutinis atsakymas?');
	//var correctAnswer = db.collection.find({answer});
	/*if ($('#checkUserAnswer').val(thisUserObject.answer) == ($('#answer').text(thisUserObject.answer))) {
		alert('Jūsų atsakymas teisingas');
	}
	if ('#checkUserAnswer' == $('#answer').text(thisUserObject.answer)) {
		alert('Jūsų atsakymas teisingas');
	}
	/*if (confirmation === true) {
		alert('Jūsų atsakymas teisingas');
	}
	else {
		return false;
	}
};*/


function changeUserInfo(event) {

  event.preventDefault();

  if($('#addUserPanel').is(":visible")){
    togglePanels();
  }

  var _id = $(this).attr('rel');
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(_id);

  var thisUserObject = userListData[arrayPosition];

	$('#updateUserLecturerName').val(thisUserObject.lecturerName);
	$('#updateUserProgrammingLanguage').val(thisUserObject.programmingLanguage);
	$('#updateUserLevel').val(thisUserObject.level);
	$('#updateUserTask').val(thisUserObject.task);
	$('#updateUserAnswer').val(thisUserObject.answer);

	$('#updateUser').attr('rel',thisUserObject._id);
};

function updateUser(event){
	event.preventDefault();

	var confirmation = confirm('Are you sure about update?');

	if (confirmation === true) {

		var _id = $(this).parentsUntil('div').parent().attr('rel');

		var fieldsToBeUpdated = $('#updateUser input.updated');

		var updatedFields = {};
		$(fieldsToBeUpdated).each(function(){
			var key = $(this).attr('placeholder').replace(" ","").toLowerCase();
			var value = $(this).val();
			updatedFields[key]=value;
		});

		$.ajax({
			type: 'PUT',
			url: '/users/updateuser/' + _id,
			data: updatedFields
		}).done(function(response) {

			if (response.msg === '') {
				togglePanels();
			} else {
				//alert('Error: ' + response.msg);
			}

			populateTable();
		});
	}
	else {
		return false;
	}
};

function deleteUser(event) {

	event.preventDefault();

	var confirmation = confirm('Are you sure?');

	if (confirmation === true) {

		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function( response ) {

			if (response.msg === '') {
			}
			else {
				alert('Error: ' + response.msg);
			}

			populateTable();

		});
	}
	else {

		return false;
	}

};

function togglePanels() {
	$('#addUserPanel').toggle();
	$('#updateUserPanel').toggle();
};
