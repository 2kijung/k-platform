// import React, { useEffect } from "react";
//
// function GasStation() {
//     useEffect(() => {
//         if (window.kakao && window.kakao.maps) {
//             const container = document.getElementById("map");
//             const options = {
//                 center: new window.kakao.maps.LatLng(37.5665, 126.9780),
//                 level: 5,
//             };
//             const map = new window.kakao.maps.Map(container, options);
//             const ps = new window.kakao.maps.services.Places();
//
//             navigator.geolocation.getCurrentPosition(pos => {
//                 const lat = pos.coords.latitude;
//                 const lng = pos.coords.longitude;
//                 const locPosition = new window.kakao.maps.LatLng(lat, lng);
//                 map.setCenter(locPosition);
//
//                 ps.keywordSearch("주유소", (data, status) => {
//                     if (status === window.kakao.maps.services.Status.OK) {
//                         data.forEach(place => {
//                             console.log("주유소 정보:", place); //  콘솔에 전체 정보 출력
//
//                             const marker = new window.kakao.maps.Marker({
//                                 position: new window.kakao.maps.LatLng(place.y, place.x),
//                             });
//                             marker.setMap(map);
//
//                             const content = `
//                 <div style="padding:5px;font-size:12px;">
//                   <b>${place.place_name}</b><br/>
//                   주소: ${place.road_address_name || place.address_name}<br/>
//                   전화: ${place.phone || "정보 없음"}<br/>
//                   <a href="${place.place_url}" target="_blank">상세보기</a>
//                 </div>
//               `;
//
//                             const infowindow = new window.kakao.maps.InfoWindow({ content });
//                             window.kakao.maps.event.addListener(marker, "click", () => {
//                                 infowindow.open(map, marker);
//                             });
//                         });
//                     }
//                 }, {
//                     location: locPosition,
//                     radius: 2000
//                 });
//             });
//         }
//     }, []);
//
//     return <div id="map" style={{ width: "1500px", height: "1500px" }}></div>;
// }
//
// export default GasStation;
import React, { useEffect, useState } from "react";

function GasStationPrice() {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        const defaultLat = 37.5665;
        const defaultLng = 126.9780;

        const fetchGasStations = (lat, lng) => {
            const url = `http://localhost:8080/api/gas?lat=${lat}&lng=${lng}`;

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data.RESULT && data.RESULT.OIL) {
                        setStations(data.RESULT.OIL);
                    }
                })
                .catch(err => console.error("API 호출 실패:", err));
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    console.log("현재 위치:", lat, lng);
                    fetchGasStations(lat, lng);
                },
                err => {
                    console.warn("GPS 사용 불가, 기본 좌표 사용:", err);
                    fetchGasStations(defaultLat, defaultLng);
                }
            );
        } else {
            console.warn("Geolocation 지원 안됨, 기본 좌표 사용");
            fetchGasStations(defaultLat, defaultLng);
        }
    }, []);

    return (
        <div>
            <h2>내 주변 주유소 유가정보</h2>
            {stations.length === 0 ? (
                <p>데이터를 불러오는 중...</p>
            ) : (
                <ul>
                    {stations.map((station, idx) => (
                        <li key={idx}>
                            <strong>{station.OS_NM}</strong> ({station.VAN_ADR}) <br />
                            휘발유: {station.B027}원 / 경유: {station.D047}원 / 고급휘발유: {station.B034}원
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GasStationPrice;