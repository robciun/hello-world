var userListData = [];

$(document).ready(function() {
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

  $('#btnAddUser').on('click', addUser);

  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

  $('#userList table tbody').on('click', 'td a.linkupdateuser', changeUserInfo);

  $('#btnCancelUpdateUser').on('click', togglePanels);

  $('#updateUser input').on('change', function(){$(this).addClass('updated')})

  $('#btnUpdateUser').on('click', updateUser);

  populateTable();
});

function populateTable() {
  var tableContent = '';

  $.getJSON( '/users/userlist', function( data ) {

    userListData = data;

    $.each(data, function(){
      tableContent += '<tr>';
	  tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.nickName + '" title="Show Details">' + this.nickName + '</a></td>';
	  tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">ištrinti</a>/<a href="#" class="linkupdateuser" rel="' + this._id + '">atnaujinti</a></td>';
	  tableContent += '</tr>';
    });

    $('#userList table tbody').html(tableContent);
  });
};

function showUserInfo(event) {
    
  event.preventDefault();

  var thisUserName = $(this).attr('rel');

  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.nickName; }).indexOf(thisUserName);

  var thisUserObject = userListData[arrayPosition];

  $('#nickName').text(thisUserObject.nickName);
  $('#password').text(thisUserObject.password);

};

function addUser(event) {
  event.preventDefault();

  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  if(errorCount === 0) {

    var newUser = {
      'nickName': $('#addUser fieldset input#inputNickName').val(),
      'password': $('#addUser fieldset input#inputPassword').val(),
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

function changeUserInfo(event) {
    
  event.preventDefault();
  
  if($('#addUserPanel').is(":visible")){
    togglePanels();
  }
    
  var _id = $(this).attr('rel');
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(_id);
       
  var thisUserObject = userListData[arrayPosition];
	
	$('#updateNickName').val(thisUserObject.nickName);
	$('#updatePassword').val(thisUserObject.password);
	
	$('#updateUser').attr('rel',thisUserObject._id);
};

function updateUser(event){
	event.preventDefault();
	
	var confirmation = confirm('Ar jus tikrai norite atnaujinti?');
	
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
	
