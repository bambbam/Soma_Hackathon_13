

var JsonData =  document.getElementById('myJsonData'); 
var myJsonData = JSON.parse(JsonData.value) //myJsonData에 우리 json파일이 들어갑니다.

var infowindow = new kakao.maps.InfoWindow({zIndex:1});
var mapContainer = document.getElementById('mapView'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.526888558257895, 126.89608433861413), // 지도의 중심좌표
        level: 5 // 지도의 확대 레벨
    };  
var map = new kakao.maps.Map(mapContainer, mapOption);  //지도를 생성합니다.

// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
var mapTypeControl = new kakao.maps.MapTypeControl();
function deg2rad(deg) { return deg * (Math.PI/180) }
function rad2deg(rad) {return rad*(180/Math.PI)}
// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// kakao.maps.ControlPosition은 컨트롤이 표 시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);


/*
// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places(); 
for(let i = 0;i<myJsonData.length;i++){
    ps.keywordSearch(myJsonData[i].road_name, placesSearchCB);
}//장소 검색
*/

// (초기값)영등포 구청 좌표

var lat = 37.526888558257895;
var lon = 126.89608433861413;


/////////////////////////////////////현재 위치 지도에 찍어주기///////////////////////////////////////////
	
	// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
function convertLocation(callback){
	if (navigator.geolocation) {

		// GeoLocation을 이용해서 접속 위치를 얻어옵니다
		navigator.geolocation.getCurrentPosition(function(position) {
			var locPositionImageSrc = 'https://ifh.cc/g/xGoaf7.png', // 마커이미지의 주소입니다
			locPositionImageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
			locPositionImageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

			// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
			var locPositionMarkerImage = new kakao.maps.MarkerImage(locPositionImageSrc, locPositionImageSize, locPositionImageOption);

			lat = position.coords.latitude, // 위도
				lon = position.coords.longitude; // 경도
			
			var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
				message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다

			// 마커와 인포윈도우를 표시합니다
			displayMarker(locPosition, locPositionMarkerImage, message);
		  });

	} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

		var locPosition = new kakao.maps.LatLng(lat, lon),    
			message = '<div style="padding:5px;">geolocation을 사용할수 없어요..</div>';
		displayMarker(locPosition, message);
	}	
	callback();
}


///////////////////////////////도로명주소 좌표로 변환 후 지도에 찍기 /////////////////////////////////////////
// 주소-좌표 변환 객체를 생성합니다
function pingOnMap(){
	var infowindowArray = [new kakao.maps.InfoWindow]
	const delete_info_window = ()=>{
		for(var i = 0;i<infowindowArray.length;i++){
			infowindowArray[i].setMap(null)
		}
	}

	let locations = document.getElementsByClassName("location");
	let meters = document.getElementsByClassName("meter");
	var dist = [{distance : 2147483647, location : ""},{distance : 2147483647, location : ""},{distance : 2147483647, location : ""}]
	
	//웹뷰일때 if문으로 들어가야 할 부분
	dist.push({distance : 2147483647, location : ""})
	dist.push({distance : 2147483647, location : ""})
	
	var geocoder = new kakao.maps.services.Geocoder();


	for (let i of myJsonData){
		// 주소로 좌표를 검색합니다
		geocoder.addressSearch(i.road_name, function(result, status) {

			// 정상적으로 검색이 완료됐으면 
			 if (status === kakao.maps.services.Status.OK) {
				//let distance = new Number();
				let distance = calcDistance(lat,lon,result[0].y, result[0].x)
				console.log(lat, lon, i.road_name, distance);
				let loc = i.location + ' ' + i.location_detail;
				dist.push({distance:distance,location:loc});
				dist.sort(function(a, b){
					return a.distance - b.distance
				})
				dist.pop();

				for(var index = 0;index<dist.length;index++){
					locations[index].innerHTML = "<span>"+dist[index].location+"<span>"
					
					if(dist[index].distance >= 1000) {
						meters[index].innerHTML = "<strong>"+ dist[index].distance/1000 +"km<strong>"	
					} else {
						meters[index].innerHTML = "<strong>"+ dist[index].distance +"m<strong>"	
					}
				}
				 //console.log(dist)
				//console.log(dist)
				//dist.push({distance : distance,object : i});
				// 500 m 이내 결과만 표시
				//if ( distance > 2000) { 
				//	console.log(distance);
				//	return; 
				//}

				var locTrashcanImageSrc = 'https://ifh.cc/g/i171yx.png', // 마커이미지의 주소입니다
				locTrashcanImageSize = new kakao.maps.Size(37, 40), // 마커이미지의 크기입니다
				locTrashcanImageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

				// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
				var locTrashcanMarkerImage = new kakao.maps.MarkerImage(locTrashcanImageSrc, locTrashcanImageSize, locTrashcanImageOption); 

				var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

				// 결과값으로 받은 위치를 마커로 표시합니다
				var marker = new kakao.maps.Marker({
					map: map,
					position: coords,
					image: locTrashcanMarkerImage,
					clickable: true
				});


				// 커스텀 오버레이에 표시할 컨텐츠 입니다
				// 커스텀 오버레이는 아래와 같이 사용자가 자유롭게 컨텐츠를 구성하고 이벤트를 제어할 수 있기 때문에
				// 별도의 이벤트 메소드를 제공하지 않습니다 

				// 마커 위에 커스텀오버레이를 표시합니다
				// 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
				var overlay = new kakao.maps.CustomOverlay({
					content: '<div style="width: 270px; height: 120px; background-color: white; color: black; border-radius: 5px; display: flex; flex-direction: column; justify-content: center; align-items: center;"> <span>' + i.location + '</span> <span>'+i.location_detail+'</span> <a href="https://map.kakao.com/link/to/'+ i.road_name + ',' + result[0].y + ',' + result[0].x + '" target="_blank"><button type="button" style="width: 120px; height: 30px; background:linear-gradient(90deg,rgba(0, 241, 143, 1) 0%, rgba(0, 150, 246, 1) 100%); color: white; border: none; border-radius: 20px; margin-top: 10px; cursor:pointer; display: flex; justify-content: center; align-items: center; "><img src="./marker2.png" alt="buttonImg" style="width: 25px; height: 25px; display: block; margin-right:5px"/><span>길찾기</span></button></a></div>', 
					map: map,
					position: marker.getPosition()       
				});
				overlay.setMap(null); 
				// 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
				kakao.maps.event.addListener(marker, 'click', function() {

					delete_info_window();
					infowindowArray.push(overlay)
					overlay.setMap(null)
					overlay.setMap(map);
				});

				// 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
				function closeOverlay() {
					overlay.setMap(null);				

				}

				/*
				// 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
				var iwContent = '<div style="padding:5px;height:20%">'+i.location + '<br>' +i.location_detail + '<b style="font-size:12px"> ' + distance + ' m</b>' + '</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
					iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

				// 인포윈도우를 생성합니다
				var infowindow = new kakao.maps.InfoWindow({
					content : iwContent,
					removable : iwRemoveable
				});
				infowindowArray.push(infowindow)
				// 마커에 클릭이벤트를 등록합니다
				kakao.maps.event.addListener(marker, 'click', function() {
					  // 마커 위에 인포윈도우를 표시합니다
					delete_info_window();
					infowindow.open(map, marker);  
				});
				*/

				// 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
				////map.setCenter(coords);
			} 
		}) 

	}
}
convertLocation(pingOnMap);
////**************************제일 가까운거 3개 추리기******************************//

// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker(locPosition, locPositionMarkerImage, message) {

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({  
        map: map, 
        position: locPosition,
        image: locPositionMarkerImage
    }); 
    
    var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

    // 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({
        content : iwContent,
        removable : iwRemoveable
    });
    
    // 인포윈도우를 마커위에 표시합니다 
    infowindow.open(map, marker);
    
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);      
}    

function calcDistance(lat1,lng1,lat2,lng2) { 
	function deg2rad(deg) { 
		return deg * (Math.PI/180) 
	} 
	var R = 6371; // Radius of the earth in km 
	var dLat = deg2rad(lat2-lat1); // deg2rad below 
	var dLon = deg2rad(lng2-lng1); 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km return d; 
	d *= 1000;
	d = Math.floor(d)
	
	// if(*)
	
	return d;
}




//a = getElementsByClassName("location");

