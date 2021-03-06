	function initialize_variables()
	{
		myLat = 0;
		myLng = 0;
		me = new google.maps.LatLng(myLat, myLng);
		myOptions = {
			zoom: 13, 
			center: me,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		infowindow = new google.maps.InfoWindow();
		numStops = 21;
		station = new Array();
	}

	function init()
	{
		initialize_variables();
		initStations();
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		drawPolyline();
		requestSchedule();
		getMyLocation();
	}

	function initStations(){
		station[0] = {'name': 'Alewife', 'lat': 42.395428, 'lon': -71.142483, 'north': 'RALEN', 'south': 'RALES', 'info': ''};
		station[1] = {'name': 'Davis', 'lat': 42.39674, 'lon': -71.121815, 'north': 'RDAVN', 'south': 'RDAVS', 'info': ' '};
		station[2] = {'name': 'Porter', 'lat': 42.3884, 'lon': -71.119149, 'north': 'RPORN', 'south': 'RPORS', 'info': ' '};
		station[3] = {'name': 'Harvard', 'lat': 42.373362, 'lon': -71.118956, 'north': 'RHARN', 'south': 'RHARS', 'info': ' '};
		station[4] = {'name': 'Central','lat': 42.365486, 'lon': -71.103802, 'north': 'RCENN', 'south': 'RCENS', 'info': ' '};
		station[5] = {'name': 'Kendall', 'lat': 42.36249079, 'lon': -71.08617653, 'north': 'RKENN', 'south': 'RKENS', 'info': ' '};
		station[6] = {'name': 'Charles MGH', 'lat': 42.361166, 'lon': -71.070628, 'north': 'RMGHN', 'south': 'RMGHS', 'info': ' '};
		station[7] = {'name': 'Park St', 'lat': 42.35639457, 'lon': -71.0624242, 'north': 'RPRKN', 'south': 'RPRKS', 'info': ' '};
		station[8] = {'name': 'Downtown Crossing', 'lat': 42.355518, 'lon': -71.060225, 'north': 'RDTCN', 'south': 'RDTCS', 'info': ' '};
		station[9] = {'name': 'South Station', 'lat': 42.352271, 'lon': -71.055242, 'north': 'RSOUN', 'south': 'RSOUS', 'info': ' '};
		station[10] = {'name': 'Broadway', 'lat': 42.342622, 'lon': -71.056967, 'north': 'RBRON', 'south': 'RBROS', 'info': ' '};
		station[11] = {'name': 'Andrew', 'lat': 42.330154, 'lon': -71.057655, 'north': 'RANDN', 'south': 'RANDS', 'info': ' '};
		station[12] = {'name': 'JFK', 'lat': 42.320685, 'lon': -71.052391, 'north': 'RJFKN', 'south': 'RJFKS', 'info': ' '};
		station[13] = {'name': 'Savinhill', 'lat': 42.31129, 'lon': -71.053331, 'north': 'RSAVN', 'south': 'RSAVS', 'info': ' '};
		station[14] = {'name': 'Fields Corner', 'lat': 42.300093, 'lon': -71.061667, 'north': 'RFIEN', 'south': 'RFIES', 'info': ' '};
		station[15] = {'name': 'Shawmut', 'lat': 42.29312583, 'lon': -71.06573796, 'north': 'RSHAN', 'south': 'RSHAS', 'info': ' '};
		station[16] = {'name': 'Ashmont', 'lat': 42.284652, 'lon': -71.064489, 'north': 'RASHN', 'south': 'RASHS', 'info': ' '};
		station[17] = {'name': 'Wollaston', 'lat': 42.2665139, 'lon': -71.0203369, 'north': 'RWOLN', 'south': 'RWOLS', 'info': ' '};
		station[18] = {'name': 'Quincy Center', 'lat': 42.251809, 'lon': -71.005409, 'north': 'RQUCN', 'south': 'RQUCS', 'info': ' '};
		station[19] = {'name': 'Quincy Adams', 'lat': 42.233391, 'lon': -71.007153, 'north': 'RQUAN', 'south': 'RQUAS', 'info': ' '};
		station[20] = {'name': 'Braintree', 'lat': 42.2078543, 'lon': -71.0011385, 'north': 'RBRAN', 'south': 'RBRAS', 'info': ' '};		
	}

	function getMyLocation()
	{
		if (navigator.geolocation) { 
			navigator.geolocation.getCurrentPosition(function(position) {
				myLat = position.coords.latitude;
				myLng = position.coords.longitude;
				nearestStop();
				renderMap();
				requestCarmenWaldo();
			});
		}
		else {
			alert("Geolocation is not supported by your web browser. What a shame!");
		}
	}

	function nearestStop(){
		nearestStop = station[0].name;
		minDistance = calculateDistance(station[0].lat, myLat, station[0].lon, myLng);
		for(var i = 1; i < numStops; i++){
			distance = calculateDistance(station[i].lat, myLat, station[i].lon, myLng);
			if (distance < minDistance){
				nearestStop = station[i].name;
				minDistance = distance;
			}
		}
	}

	Number.prototype.toRad = function()
	{
		return this * Math.PI / 180;
	}	

	function calculateDistance(lat1, lat2, lon1, lon2)
	{
		
		var R = 3958.57440545;
		var dLat = (lat2-lat1).toRad();
		var dLon = (lon2-lon1).toRad();
		var lat1 = lat1.toRad();
		var lat2 = lat2.toRad();
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        		Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;
		return d;
	}

	function requestCarmenWaldo(){

		try {

			request = new XMLHttpRequest();

		}

		catch (ms1) {
			try {
				request = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (ms2) {
				try {
					request = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (ex) {
					request = null;
				}
			}
		}

		if (request == null) {
			alert("Error creating request object -- Ajax not supported?");
		}


		try {

			request.open("GET", "http://messagehub.herokuapp.com/a3.json", true);

			request.send(null);

			request.onreadystatechange = callbackCarmenWaldo;

		}

		catch (error) {


		}

	}

	function callbackCarmenWaldo(){

		try {

			if (request.readyState == 4 && request.status == 200){
				waldo = new Object();
				carmen = new Object();
				waldo.exist = 'false';
				carmen.exist = 'false';
				parsed = JSON.parse(request.responseText);
				for (var i = 0; i < parsed.length; i++){
					if (parsed[i].name == 'Waldo'){
						waldo.lat = parsed[i]['loc']['latitude'];
						waldo.lon = parsed[i]['loc']['longitude'];
						waldo.note = parsed[i]['loc']['note'];
						waldo.exist = 'true';
						waldo.distance = calculateDistance(waldo.lat, myLat, waldo.lon, myLng);
					}
					if (parsed[i].name == 'Carmen Sandiego'){
						carmen.lat = parsed[i]['loc']['latitude'];
						carmen.lon = parsed[i]['loc']['longitude'];
						carmen.note = parsed[i]['loc']['note'];
						carmen.exist = 'true';
						carmen.distance = calculateDistance(carmen.lat, myLat, carmen.lon, myLng);
					}
				}
				if (waldo.exist == 'true'){
					var loc = new google.maps.LatLng(waldo.lat, waldo.lon);
					var marker = new google.maps.Marker({
						position: loc,
						title: 'Waldo',
						icon: 'waldo.png'
					});
					marker.setMap(map);
				
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.close();
						infowindow.setContent(waldo.note + '<br>' + 'Distance from you: '
							+ waldo.distance + ' miles');
						infowindow.open(map, this);
					});
				}
				if (carmen.exist == 'true'){
					var loc = new google.maps.LatLng(carmen.lat, carmen.lon);
					var marker1 = new google.maps.Marker({
						position: loc,
						title: 'Carmen',
						icon: 'carmen.png'
					});
					marker1.setMap(map);
				
					google.maps.event.addListener(marker1, 'click', function() {
						infowindow.close();
						infowindow.setContent(carmen.note + '<br>' + 'Distance from you: '
							+ carmen.distance + ' miles');
						infowindow.open(map, this);
					});
				}
			}

		}

		catch (error) {

		}

	}
	
	
	function requestSchedule(){

		try {

			requestsched = new XMLHttpRequest();

		}

		catch (ms1) {
			try {
				requestsched = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (ms2) {
				try {
					requestsched = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (ex) {
					requestsched = null;
				}
			}
		}

		if (requestsched == null) {
			alert("Error creating request object -- Ajax not supported?");
		}

		try {

			requestsched.open("GET", "http://mbtamap-cedar.herokuapp.com/mapper/redline.json", true);

			requestsched.send(null);

			requestsched.onreadystatechange = callbackSchedule;

		}

		catch (error) {

			alert("Whoops, exception caught!");

		}

	}

	function callbackSchedule(){

		try {

			if (requestsched.readyState == 4 && requestsched.status == 200) {

				parsedSched = JSON.parse(requestsched.responseText);
				
				for (var i = 0; i < station.length; i++){
					
					for (var j = 0; j < parsedSched.length; j++){
						if (parsedSched[j].PlatformKey == station[i].north && parsedSched[j].InformationType == 'Predicted'){
							station[i].info = station[i].info + '<tr><td>' + parsedSched[j].Line + '</td><td>' + parsedSched[j].Trip + '</td><td>' + 'north' + '</td><td>' + parsedSched[j].TimeRemaining + '</td></tr>';
						}
						if (parsedSched[j].PlatformKey == station[i].south && parsedSched[j].InformationType == 'Predicted'){
							station[i].info = station[i].info + '<tr><td>' + parsedSched[j].Line + '</td><td>' + parsedSched[j].Trip + '</td><td>' + 'south' + '</td><td>' + parsedSched[j].TimeRemaining + '</td></tr>';
						}
					}
					
				}
					
			}

		}

		catch (error) {

			alert("Whoops, exception caught!");

		}

	}

				
	function renderMap()
	{
		var me = new google.maps.LatLng(myLat, myLng);
		map.panTo(me);
		var marker = new google.maps.Marker({
			position: me,
			title: 'You are here' + '<br>' + 'Closest Station: ' 
			      + nearestStop + '<br>' + 'Distance: ' + minDistance
			      + ' miles'
				
		});
		marker.setMap(map);

		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
		
		for (var i = 0; i < numStops; i++){
			createMarker(station[i]);
		}
	}


	function createMarker(place)
	{			
		var loc = new google.maps.LatLng(place.lat, place.lon);
		var marker = new google.maps.Marker({
			position: loc,
			title: place.name,
			icon: 'mbtaT.png'
		});
		marker.setMap(map);


		google.maps.event.addListener(marker, 'click', function() {
			information = place.name + 
					'<table id="schedule"><tr><th>Line</th><th>Trip #</th><th>Direction</th><th>Time Remaining</th></tr>' + 
					place.info +
					'</table>';
			infowindow.close();
			infowindow.setContent(information);
			infowindow.open(map, this);
		});
      	}

	function drawPolyline()
	{
		ashmontJFK = new Array();
		for(var i = 0; i < 13; i++){
			ashmontJFK[i] = new google.maps.LatLng(station[i].lat, station[i].lon);
		}
        	var redAshmontJFK = new google.maps.Polyline({
          		path: ashmontJFK,
          		strokeColor: '#FF0000',
          		strokeOpacity: 1.0,
          		strokeWeight: 5
       		});
		redAshmontJFK.setMap(map);
		JFKAshmont = new Array();
		var count1 = 0;
		for(var j = 12; j < 17; j++){
			JFKAshmont[count1] = new google.maps.LatLng(station[j].lat, station[j].lon);
			count1++;
		}
		var redJFKAshmont = new google.maps.Polyline({
			path: JFKAshmont,
          		strokeColor: '#FF0000',
          		strokeOpacity: 1.0,
          		strokeWeight: 5
       		});
		redJFKAshmont.setMap(map);
		JFKBraintree = new Array();
		var count2 = 0;
		for(var k = 17; k < numStops; k++){
			JFKBraintree[count2] = new google.maps.LatLng(station[k].lat, station[k].lon);
			count2++;
		}
		var redJFKBraintree = new google.maps.Polyline({
			path: JFKBraintree,
          		strokeColor: '#FF0000',
          		strokeOpacity: 1.0,
          		strokeWeight: 5
       		});
		redJFKBraintree.setMap(map);
		JFKNQuincy = new Array();
		JFKNQuincy[0] = new google.maps.LatLng(station[12].lat, station[12].lon);
		JFKNQuincy[1] = new google.maps.LatLng(station[17].lat, station[17].lon);
		var redJFKNQuincy = new google.maps.Polyline({
			path: JFKNQuincy,
          		strokeColor: '#FF0000',
          		strokeOpacity: 1.0,
          		strokeWeight: 5
		});
		redJFKNQuincy.setMap(map);
	}	