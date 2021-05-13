

var JsonData =  document.getElementById('myJsonData'); 
var myJsonData = JSON.parse(JsonData.value) //myJsonData에 우리 json파일이 들어갑니다.

var infowindow = new kakao.maps.InfoWindow({zIndex:1});
var mapContainer = document.getElementById('mapView'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
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
var lat = 37.52637839534077;
var lon = 126.89626025782465;


/////////////////////////////////////현재 위치 지도에 찍어주기///////////////////////////////////////////
	
	// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
if (navigator.geolocation) {

    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude, lon = position.coords.longitude; // 위도,경도
        
        var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            message = '<div style="padding:5px;">현재 위치</div>'; // 인포윈도우에 표시될 내용입니다
        
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
            
      });
    
} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    
    var locPosition = new kakao.maps.LatLng(lat, lon),    
        message = '<div style="padding:5px;">geolocation을 사용할수 없어요..</div>';
        
    displayMarker(locPosition, message);
}
	

///////////////////////////////도로명주소 좌표로 변환 후 지도에 찍기 /////////////////////////////////////////
// 주소-좌표 변환 객체를 생성합니다

var infowindowArray = [new kakao.maps.InfoWindow]
const delete_info_window = ()=>{
	for(var i = 0;i<infowindowArray.length;i++){
		infowindowArray[i].close()
	}
}
var distance = [0]
var geocoder = new kakao.maps.services.Geocoder();
for (let i of myJsonData){
	// 주소로 좌표를 검색합니다
	geocoder.addressSearch(i.road_name, function(result, status) {
		
		// 정상적으로 검색이 완료됐으면 
		 if (status === kakao.maps.services.Status.OK) {
			 
			var distance = calcDistance(lat,lon,result[0].y, result[0].x);
			// 500 m 이내 결과만 표시
			//if ( distance > 2000) { 
			//	console.log(distance);
			//	return; 
			//}
			 
			var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

			// 결과값으로 받은 위치를 마커로 표시합니다
			var marker = new kakao.maps.Marker({
				map: map,
				position: coords,
				clickable: true
			});
			
			 
			// 커스텀 오버레이에 표시할 컨텐츠 입니다
			// 커스텀 오버레이는 아래와 같이 사용자가 자유롭게 컨텐츠를 구성하고 이벤트를 제어할 수 있기 때문에
			// 별도의 이벤트 메소드를 제공하지 않습니다 
			let contents = '<div class="wrap">' + 
						'    <div class="info">' + 
						'        <div class="title">' + 
						'            카카오 스페이스닷원' + 
						'            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
						'        </div>' + 
						'        <div class="body">' + 
						'            <div class="img">' +
						'                <img src="https://cfile181.uf.daum.net/image/250649365602043421936D" width="73" height="70">' +
						'           </div>' + 
						'            <div class="desc">' + 
						'                <div class="ellipsis">제주특별자치도 제주시 첨단로 242</div>' + 
						'                <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div>' + 
						'                <div><a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div>' + 
						'            </div>' + 
						'        </div>' + 
						'    </div>' +    
						'</div>';

			// 마커 위에 커스텀오버레이를 표시합니다
			// 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
			var overlay = new kakao.maps.CustomOverlay({
				content: '<div style="padding:5px;height:20%">'+i.location + '<br>' +i.location_detail + '<b style="font-size:12px"> ' + distance + ' m</b>' + '</div>',
				map: map,
				position: marker.getPosition()       
			});

			// 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
			kakao.maps.event.addListener(marker, 'click', function() {
				console.log(marker.getPosition())
				console.log(overlay.content)
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

	
	
// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker(locPosition, message) {

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({  
        map: map, 
        position: locPosition
    }); 
    
    var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

    // 인포윈도우를 생성합니다
	
	infowindowArray[0].content = iwContent;
	infowindowArray[0].removable = iwRemoveable;
	var infowindow = infowindowArray[0];
	/*
    var infowindow = new kakao.maps.InfoWindow({
        content : iwContent,
        removable : iwRemoveable
    });*/
    infowindowArray.push(infowindow);
    // 인포윈도우를 마커위에 표시합니다 
    infowindow.open(map, marker);
    
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);      
}    	



// 거리계산 함수
function calcDistance(lat1, lon1, lat2, lon2) {

	lat1 = parseFloat(lat1).toFixed(7);
	lon1 = parseFloat(lon1).toFixed(7);
	lat2 = parseFloat(lat2).toFixed(7);
	lon2 = parseFloat(lon2).toFixed(7);
	var theta = lon1 - lon2;
	dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1))
		* Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
	dist = Math.acos(dist);
	dist = rad2deg(dist);
	dist = dist * 60 * 1.1515;
	dist = dist * 1.609344;
	return Number(dist*1000).toFixed(0);
}
//a = getElementsByClassName("location");
