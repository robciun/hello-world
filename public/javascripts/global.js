var userListData = [];

$(document).ready(function() {
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  
  $('#userList table tbody').on('click', 'td a.linkcheckanswer', checkUserInfo);
  
  $('#btnCheckAnswer').on('click', checkUser);

  populateTable();
});

function populateTable() {
  var tableContent = '';

  $.getJSON( '/users/userlist', function( data ) {

    userListData = data;

    $.each(data, function(){
      tableContent += '<tr>';
	  tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.lecturerName + '" title="Show Details">' + this.lecturerName + '</a></td>';
	  //tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">ištrinti</a>/<a href="#" class="linkupdateuser" rel="' + this._id + '">atnaujinti</a></td>';
      tableContent += '<td><a href="#" class="linkcheckanswer" rel="' + this._id + '">atsakyti</a></td>';
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
  //$('#answer').text(thisUserObject.answer);

};

function checkUserInfo(event){
	event.preventDefault();
	
	var _id = $(this).attr('rel');
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(_id);
       
    var thisUserObject = userListData[arrayPosition];
 
	$('#checkUserAnswer').val(thisUserObject.answer);
	
	$('#checkUser').attr('rel', thisUserObject._id);
};
	
function checkUser(event){
	event.preventDefault();
	
	var confirmation = confirm('Ar tai jūsų galutinis atsakymas?');	
	//var correctAnswer = db.collection.find({answer});
	/*if ($('#checkUserAnswer').val(thisUserObject.answer) == ($('#answer').text(thisUserObject.answer))) {
		alert('Jūsų atsakymas teisingas');
	}*/
	
	if (confirmation === true) {
		alert('Jūsų atsakymas teisingas');
	}
	else {
		return false;
	}
};
	
function togglePanels() {
	$('#addUserPanel').toggle();
	$('#updateUserPanel').toggle();
};
	
