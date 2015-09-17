lform = document.getElementById('locker-form')

thisPropertyId = "000000";
var OpenDoor;
var usersData;

var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        usersData = JSON.parse(xmlhttp.responseText);
        handleData(usersData);
    }
}
xmlhttp.open("GET", '/api/data.json', true);
xmlhttp.send();

function generateMenu(items) {
	var ul = document.createElement('ul');

	items.forEach(function(item) {

		var li = document.createElement('li');
	    var input = document.createElement('input');
	    
	    input.type = "button";
	    input.value = item.name;
	    input.name = "door";

		li.appendChild(input);

	    ul.appendChild(li);

	});
	return ul;
}

function handleData(doorsData) {

	/* Getting all the doors for Clay property (id=000000) using underscorejs */
	doors = _.uniq(_.flatten(_.pluck(doorsData.users, 'doors')), function (item) {
		if (item.propertyId == thisPropertyId) {
			return 'name:' + item.name + 'id:' + item.id;
		}
	});
	doors = _.map(_.groupBy(doors,function(item){
	  return 'name:' + item.name + 'id:' + item.id;
	}),function(grouped){
	  return grouped[0];
	});
	menunav = generateMenu(doors);
	menunav.id = 'buttons';
	lform.appendChild(menunav);
	var pInput = document.createElement('input');
	pInput.type = "hidden";
	pInput.name = "property";
	pInput.value = thisPropertyId;
	lform.appendChild(pInput);
}

$('#locker-form').on('click','input[type="button"]', function(){
	$('#response .cell').html('');
	$('.loader').removeClass('denied').removeClass('granted');
	$('.spinner').addClass('checking');
	$submit = $(this);
	setTimeout(function(){ 
		var data = {};
		data.users = usersData.users;
		data.username = $('#locker-form input[type="text"]').val();
		data.password = $('#locker-form input[type="password"]').val();
		data.property = $('#locker-form input[type="hidden"]').val();
		data.door = $submit.val();
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
	        contentType: 'application/json',
	        url: '/open',
	        success    : function(data){
	        	$('#response .cell').html(JSON.parse(data).text);
	        	$('.loader').addClass(JSON.parse(data).flag);
	        	$('.spinner').removeClass('checking');
	        },
	        error     : function(jqXHR, textStatus, errorThrown) {
	        	$('#response .cell').html('<p>Communication Error</p>');
			 	console.log('Error loading users data');
	        }
	    });
	}, 3000);
});