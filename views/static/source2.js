

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

// 체크
var lat = 37.526888558257895;
var lon = 126.89608433861413;
var homeMarker;
var homeInfoWindow;

// var lat = 37.6273217;
// var lon = 127.1514821;
var now_roadname = ""
//var infowindow;


function calculate_loading(){
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position)){
													 
		}
		
	}
}




/////////////////////////////////////현재 위치 지도에 찍어주기///////////////////////////////////////////
// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
function convertLocation(callback){
	if (navigator.geolocation) {
		

		//그래서 우리 위치를 정하고 다음 거리를 계산하려고 순서를 맞춰준거에요
		navigator.geolocation.getCurrentPosition(function(position) {
			
			var locPositionImageSrc = 'https://ifh.cc/g/xGoaf7.png', // 마커이미지의 주소입니다
			locPositionImageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
			locPositionImageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

			// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
			var locPositionMarkerImage = new kakao.maps.MarkerImage(locPositionImageSrc, locPositionImageSize, locPositionImageOption);

			//locPositionMarkerImage.setClickable(true);

			lat = position.coords.latitude, // 위도
			lon = position.coords.longitude; // 경도
			
			var geocoder = new kakao.maps.services.Geocoder();
			
			// async function a
			function searchAddrFromCoords(coords, callback) {
				// 좌표로 행정동 주소 정보를 요청합니다
				geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);   
			}
			searchAddrFromCoords(new kakao.maps.LatLng(lat, lon), displayCenterInfo);
			
			console.log("chk1" + now_roadname)
			// console.log(lat, lon);
			//여기에서 도로명 주소를 계산을 해버리자.
			var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
				// message = '<div style="padding:5px;">여기에 계신가요?</div>'; // 인포윈도우에 표시될 내용입니다
				message = '<div id="homeInfo" style="width: 170px; height: 80px; background-color: white; color: black; border-radius: 5px; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size:18px; padding:5px;"><span style="margin-top:10px;">여기에 계신가요?</span><button id="btn-setLocation" onClick="setLocation()" style="width: 100px; height: 40px; background:#082d64; color: white; border: none; border-radius: 20px; padding: 5px; margin: 10px 0; cursor:pointer; display: flex; justify-content: center; align-items: center; ">위치 조정</button></div>'; // 인포윈도우에 표시될 내용입니다


			// 마커와 인포윈도우를 표시합니다
			var homeObject = displayMarker(locPosition, locPositionMarkerImage, message);
			homeMarker = homeObject.homeMarker;
			// homeInfoWindow = homeObject.homeInfoWindow;
			homeMarker.setClickable(true)


			// 마커에 클릭이벤트를 등록합니다
			kakao.maps.event.addListener(homeMarker, 'click', function() {
				  // 마커 위에 인포윈도우를 표시합니다
				  homeInfoWindow.open(map, homeMarker);  
			});
							// 주소-좌표 변환 객체를 생성합니다
			// var geocoder = new kakao.maps.services.Geocoder();
			// // now_roadname = 
			// function searchAddrFromCoords(coords, callback) {
			// 	// 좌표로 행정동 주소 정보를 요청합니다
			// 	geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
			// }
			// searchAddrFromCoords(new kakao.maps.LatLng(lat, lon), displayCenterInfo);
		});
		

	

	} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

		var locPosition = new kakao.maps.LatLng(lat, lon),    
			message = '<div style="padding:5px;">geolocation을 사용할 수 없어요ㅜㅜ</div>';
		displayMarker(locPosition, message);
		searchAddrFromCoords(new kakao.maps.LatLng(lat, lon), displayCenterInfo);
		
		
	}	
	

	function displayCenterInfo(result, status) {

		console.log("displayCenterInfo")
		if (status === kakao.maps.services.Status.OK) {

			for(var i = 0; i < result.length; i++) {
				// 행정동의 region_type 값은 'H' 이므로
				if (result[i].region_type === 'H') {
					now_roadname = result[i].address_name;
					console.log("chk2" + now_roadname);
					break;
				}
			}
		}    
	}
	console.log("convertLocation");
	
	callback(get_three_element); 
}




///////////////////////////////도로명주소 좌표로 변환 후 지도에 찍기 /////////////////////////////////////////
// 주소-좌표 변환 객체를 생성합니다
var dist = [];
var infowindowArray = [new kakao.maps.InfoWindow]
const delete_info_window = ()=>{
	for(var i = 0;i<infowindowArray.length;i++){
		infowindowArray[i].setMap(null)
	}
}

function pingOnMap(callback){
	console.log("pingOnMap");
	var tempdist = []


	let locations = document.getElementsByClassName("location");
	let meters = document.getElementsByClassName("meter");
	dist = [{distance : 2147483647, location : "", road_name:""}, {distance : 2147483647, location : "", road_name:""}, {distance : 2147483647, location : "", road_name:""}]
	
	//웹뷰일때 if문으로 들어가야 할 부분
	dist.push({distance : 2147483647, location : "", road_name:""})
	dist.push({distance : 2147483647, location : "", road_name:""})
	
	
	var geocoder = new kakao.maps.services.Geocoder();

	var cnt = 0;
	
	for (let i of myJsonData){
		
		// 주소로 좌표를 검색합니다
		geocoder.addressSearch(i.road_name, async function(result, status) {
			
			// var geocoder = new kakao.maps.services.Geocoder();
			
			// function searchAddrFromCoords(coords, callback) {
			// 	// 좌표로 행정동 주소 정보를 요청합니다
			// 	geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);   
			// }
			
			await ++cnt;
			
			// await searchAddrFromCoords(new kakao.maps.LatLng(lat, lon), displayCenterInfo);

			// 정상적으로 검색이 완료됐으면 
			 if (status === kakao.maps.services.Status.OK) {
				
				let distance = calcDistance(lat,lon,result[0].y, result[0].x)
				let loc = i.location + ' ' + i.location_detail;
				dist.push({distance:distance, location:loc, road_name:i.road_name});
				tempdist.push({distance:distance, location:loc, road_name:i.road_name});
				// dist.sort(function(a, b){
				// 	return a.distance - b.distance
				// })
				// dist.pop();
				 
			
				if(cnt == myJsonData.length) {
					
					dist.sort(function(a, b){
						return a.distance - b.distance
					})
					
					// for(var index = 0; index < dist.length; index++){
					for(var index = 0; index < 5; index++){
						locations[index].innerHTML = "<span>"+dist[index].location+"</span>"

						if(dist[index].distance >= 1000) {
							meters[index].innerHTML = "<strong>"+ dist[index].distance/1000 +"km</strong>"	
						} else {
							meters[index].innerHTML = "<strong>"+ dist[index].distance +"m</strong>"	
						}
					}	
				}
                 
                if (distance < 500) {
                    locTrashcanImageSrc = 'https://ifh.cc/g/i171yx.png'; // Opacity 100%
                } else if (500 < distance && distance < 1000) {
                    locTrashcanImageSrc = 'https://ifh.cc/g/ZyruBA.png'; // Opacity 80%
                } else {
                    locTrashcanImageSrc = 'https://ifh.cc/g/v0gop2.png'; // Opacity 50%
                }

				var locTrashcanImageSize = new kakao.maps.Size(37, 40), // 마커이미지의 크기입니다
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
				
				//road_name이 채워지지 않은채로 넘어오네요..  
				 
				 
				
				console.log("chk3" + now_roadname);
				// 마커 위에 커스텀오버레이를 표시합니다
				// 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
				var latlng = marker.getPosition()
				var overlay = new kakao.maps.CustomOverlay({
					content: '<div style="width: 270px; height: 120px; background-color: white; color: black; border-radius: 5px; display: flex; flex-direction: column; justify-content: center; align-items: center;"> <button style=" width: 100%; border: none; background-color: transparent; margin: 7px 20px; display: flex; justify-content: flex-end; cursor:pointer;"> <img src="./remove.png" onclick = "delete_info_window()" alt="close" style="width: 20px; height: 20px" /> </button><span>' + i.location + '</span> <span>'+i.location_detail+'</span> <a href="https://map.kakao.com/?map_type=TYPE_MAP&target=walk&rt=%2C%2C477523%2C1110662&rt1='+now_roadname+'&rt2='+ i.road_name +'&rtIds=%2C&rtTypes=%2C" target="_blank"><button type="button" style="width: 120px; height: 30px; background:linear-gradient(90deg,rgba(0, 241, 143, 1) 0%, rgba(0, 150, 246, 1) 100%); color: white; border: none; border-radius: 20px; margin: 10px 0; cursor:pointer; display: flex; justify-content: center; align-items: center; "><img src="./marker2.png" alt="buttonImg" style="width: 25px; height: 25px; display: block; margin-right:5px"/><span>길찾기</span></button></a></div>',        
					map: map,
					//position: marker.getPosition(),   
					position: new kakao.maps.LatLng(latlng.getLat()+0.0002, latlng.getLng())
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
	
	
	
	// console.log(tempdist)
// 	console.log(dist[0].location)
// 	console.log(dist[4].location)
	callback(tempdist)
}

function get_three_element(tempdist){
	
	
	console.log("@@@");
	tempdist.sort();
	console.log(tempdist)
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
	infowindow = "";
	// infowindow = new kakao.maps.InfoWindow({
	// content : iwContent,
	// removable : iwRemoveable
	// });
    
    // 인포윈도우를 마커위에 표시합니다 
    // infowindow.open(map, marker);
    
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);      
	
	return {homeMarker:marker, homeInfoWindow:infowindow};
	
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



var iconElement = document.getElementsByClassName("grid")
for(let i = 0;i<iconElement.length;i++){
	iconElement[i].addEventListener("click",iconHandler(i))
}

function iconHandler(i){
	return function(){
		console.log(now_roadname);
		var url = 
		"https://map.kakao.com/?map_type=TYPE_MAP&target=car&rt=%2C%2C477523%2C1110662&rt1="+now_roadname+"&rt2="+dist[i].road_name+"&rtIds=%2C&rtTypes=%2C"
		window.open(url,'_blank');
	}
}


kakao.maps.event.addListener(map, 'click', clickHandler = function(mouseEvent){
	// 클릭한 위도, 경도 정보를 가져옵니다 
	var latlng = mouseEvent.latLng; 
	lat = latlng.getLat();
	lon = latlng.getLng();

	// 마커 위치를 클릭한 위치로 옮깁니다
	homeMarker.setPosition(latlng);
	var geocoder = new kakao.maps.services.Geocoder();
	function searchAddrFromCoords(coords, callback) {
		// 좌표로 행정동 주소 정보를 요청합니다
		geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);   
	}
	searchAddrFromCoords(new kakao.maps.LatLng(lat, lon), displayCenterInfo);
	function displayCenterInfo(result, status) {

		console.log("displayCenterInfo")
		if (status === kakao.maps.services.Status.OK) {

			for(var i = 0; i < result.length; i++) {
				// 행정동의 region_type 값은 'H' 이므로
				if (result[i].region_type === 'H') {
					now_roadname = result[i].address_name;
					console.log("chk2" + now_roadname);
					break;
				}
			}
		}    
	}
	
	// 이거 되나요? 되는거 같긴 해요  오..갓... 근데 이것도 한번 되고 ㄱ글그러네요 크흠..ㅜㅜ
	// 뭔가 addListner랑 pingOnMap이랑 충돌나는것 같아요
	console.log(now_roadname)
	//searchAddrFromCoords(new kakao.maps.LatLng(lat, lon), displayCenterInfo);
	//된다!!!!!!! ?! 콜백함수를 안넘겨 주고 있었어오.. ㅏ; 빛기웅님 ? 빛 민수님? 인가요?
	//킹문해가 해냈습니다
	// 역시; 믿고 있었다구욧
	pingOnMap(get_three_element); // 새로운 lat, lon 기준으로 재시작
}); 

///// 위치 조정 버튼 클릭 시 이동 가능 /////
function setLocation(){
	var homeInfo = document.getElementById('homeInfo');
	var btnInfo = document.getElementById('btn-setLocation');
	console.log("hello, kakao");
	console.log(homeInfo);
	// homeInfo.innerHTML = '<div style="width: 180px; height: 80px; background-color: white; color: black; border-radius: 5px; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size:18px; padding:5px;"><span style="margin-top:10px;">위치를 지정해주세요</span><button onClick="stop_marker(map)" style="width: 70px; height: 40px; background:#082d64; color: white; border: none; border-radius: 20px; margin: 10px 0; cursor:pointer; display: flex; justify-content: center; align-items: center;">여기!</button></div>';
	// var infowindow = new kakao.maps.InfoWindow({
    //     content: '<div>여기인가요? <button onClick="stop_marker(map)">네!</button></div>' // 인포윈도우에 표시할 내용
    // });
	
	kakao.maps.event.addListener(map, 'click', clickHandler = function(mouseEvent){
		// 클릭한 위도, 경도 정보를 가져옵니다 
		var latlng = mouseEvent.latLng; 
		lat = latlng.getLat();
		lon = latlng.getLng();

		// 마커 위치를 클릭한 위치로 옮깁니다
		homeMarker.setPosition(latlng);
		searchAddrFromCoords(new kakao.maps.LatLng(lat, lon), displayCenterInfo);
		pingOnMap();
		// btnInfo.innerHTML = "여기!";
		// homeInfoWindow.setPosition(latlng);
		// infowindow.open(map, homeMarker);
	}); 
}

/////// 기준 위치 조정(mouseEvent) 중지 ///////
function stop_marker(map) {

	// var homeInfo = document.getElementById('homeInfo');
	// homeInfo.innerHTML = '<div id="homeInfo" style="width: 170px; height: 80px; background-color: white; color: black; border-radius: 5px; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size:18px; padding:5px;"><span style="margin-top:10px;">여기에 계신가요?</span><button id="btn-setLocation" onClick="setLocation()" style="width: 100px; height: 40px; background:#082d64; color: white; border: none; border-radius: 20px; padding: 5px; margin: 10px 0; cursor:pointer; display: flex; justify-content: center; align-items: center; ">위치 조정</button></div>';
	console.log("stop_marker called", map);
	kakao.maps.event.removeListener(map, 'click', clickHandler);
	console.log("Last position : ",lat, lon);
	homeMarker.setPosition(latlng);
	searchAddrFromCoords(new kakao.maps.LatLng(lat, lon), displayCenterInfo);
	pingOnMap(); // 새로운 lat, lon 기준으로 재시작
}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow) {
    return function() {
        infowindow.open(map, marker);
    };
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다 
function makeOutListener(infowindow) {
    return function() {
        infowindow.close();
    };
}