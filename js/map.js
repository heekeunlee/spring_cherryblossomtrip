// ===== Google Maps Configuration =====
const MAPS_CONFIG = {
  darkStyle: [
    { elementType: "geometry", stylers: [{ color: "#0f1628" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0f1628" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0e2013" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a2540" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1e3560" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#071729" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
  ]
};

// ===== Drive Route Map (Suwon -> Changwon) =====
function initDriveMap() {
  const mapEl = document.getElementById('drive-map-canvas');
  if (!mapEl) return;

  const map = new google.maps.Map(mapEl, {
    zoom: 8,
    center: { lat: 36.2, lng: 127.9 },
    styles: MAPS_CONFIG.darkStyle,
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: 'cooperative',
  });

  // Waypoints
  const waypoints = [
    { lat: 37.2636, lng: 127.0286, label: '🏠 수원 출발', color: '#F4A7B9' },
    { lat: 36.9022, lng: 127.1467, label: '☕ 망향휴게소\n망향비빔국수', color: '#F59E0B' },
    { lat: 35.9103, lng: 127.7189, label: '☕ 덕유산휴게소\n도토리묵밥', color: '#F59E0B' },
    { lat: 35.1541, lng: 128.6980, label: '🌸 진해·창원 도착', color: '#10B981' },
  ];

  // Draw markers
  waypoints.forEach((wp, i) => {
    const marker = new google.maps.Marker({
      position: { lat: wp.lat, lng: wp.lng },
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: i === 0 || i === waypoints.length - 1 ? 10 : 8,
        fillColor: wp.color,
        fillOpacity: 1,
        strokeColor: '#0A0E1A',
        strokeWeight: 2,
      },
      title: wp.label,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="
        background:#111827;color:#F9FAFB;padding:12px 16px;
        border-radius:12px;font-family:'Noto Sans KR',sans-serif;
        font-size:13px;min-width:140px;line-height:1.6;
        border:1px solid rgba(255,255,255,0.1);
        white-space:pre-line;
      ">${wp.label}</div>`,
    });

    marker.addListener('click', () => infoWindow.open(map, marker));
    if (i === 0 || i === waypoints.length - 1) {
      infoWindow.open(map, marker);
    }
  });

  // Draw route using DirectionsService
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#F4A7B9',
      strokeOpacity: 0.8,
      strokeWeight: 4,
    },
  });
  directionsRenderer.setMap(map);

  directionsService.route({
    origin: { lat: 37.2636, lng: 127.0286 },
    destination: { lat: 35.1541, lng: 128.698 },
    waypoints: [
      { location: { lat: 36.9022, lng: 127.1467 }, stopover: false },
      { location: { lat: 35.9103, lng: 127.7189 }, stopover: false },
    ],
    travelMode: google.maps.TravelMode.DRIVING,
  }, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result);
    }
  });
}

// ===== Spot Map (Jinhae Spots) =====
function initSpotMap() {
  const mapEl = document.getElementById('spot-map-canvas');
  if (!mapEl) return;

  const center = { lat: 35.155, lng: 128.685 };

  const map = new google.maps.Map(mapEl, {
    zoom: 13,
    center,
    styles: MAPS_CONFIG.darkStyle,
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: 'cooperative',
  });

  const spots = [
    {
      lat: 35.1723, lng: 128.6923,
      name: '경화역 플랫폼',
      emoji: '🌸',
      desc: '벚꽃 터널 + 기찻길 인생샷 명소\n추천: 오전 08:00~09:30',
      day: 'Day 1',
      color: '#F4A7B9',
    },
    {
      lat: 35.1581, lng: 128.7012,
      name: '여좌천 로망스다리',
      emoji: '🌉',
      desc: '드라마 촬영지, 벚꽃 물길\n야간 조명 야경 추천',
      day: 'Day 1',
      color: '#F4A7B9',
    },
    {
      lat: 35.1545, lng: 128.6929,
      name: '중원로터리',
      emoji: '🎪',
      desc: '군항제 메인 광장\n군악대 공연·포토존',
      day: 'Day 1',
      color: '#F59E0B',
    },
    {
      lat: 35.1553, lng: 128.6893,
      name: '진해루 전망대',
      emoji: '🏯',
      desc: '진해 시내 + 벚꽃 파노라마\n16:30 황금빛 뷰 추천',
      day: 'Day 1',
      color: '#F59E0B',
    },
    {
      lat: 35.1383, lng: 128.6956,
      name: '해군사관학교',
      emoji: '⚓',
      desc: '군항제 기간만 개방\n09:00 개장 직후 방문 추천',
      day: 'Day 2',
      color: '#3B82F6',
    },
    {
      lat: 35.1759, lng: 128.6551,
      name: '장복산 공원',
      emoji: '⛰️',
      desc: '진해만·마산만 바다조망\n이른 아침 07:30 추천',
      day: 'Day 3',
      color: '#10B981',
    },
    {
      lat: 35.1847, lng: 128.6432,
      name: '안민고개',
      emoji: '🚗',
      desc: '진해→창원 벚꽃 드라이브\n왕복 30~40분',
      day: 'Day 3',
      color: '#10B981',
    },
    {
      lat: 35.1610, lng: 128.6720,
      name: '북원광장',
      emoji: '🎭',
      desc: '플리마켓·특산물 장터\n군항제 문화행사',
      day: 'Day 2',
      color: '#3B82F6',
    },
    {
      lat: 35.1680, lng: 128.6800,
      name: '진해만 생태숲',
      emoji: '🌿',
      desc: '조용한 벚꽃 숲\n인파 적은 숨은 명소',
      day: 'Day 3',
      color: '#10B981',
    },
  ];

  const dayColors = { 'Day 1': '#F4A7B9', 'Day 2': '#3B82F6', 'Day 3': '#10B981' };

  spots.forEach((spot) => {
    const marker = new google.maps.Marker({
      position: { lat: spot.lat, lng: spot.lng },
      map,
      icon: {
        path: 'M 0,-12 C -6,-12 -10,-7 -10,0 C -10,6 -5,11 0,16 C 5,11 10,6 10,0 C 10,-7 6,-12 0,-12 Z',
        fillColor: dayColors[spot.day] || '#F4A7B9',
        fillOpacity: 1,
        strokeColor: '#0A0E1A',
        strokeWeight: 2,
        scale: 1.2,
        anchor: new google.maps.Point(0, 16),
      },
      title: spot.name,
    });

    const infoContent = `
      <div style="
        background:#111827;color:#F9FAFB;padding:14px 16px;
        border-radius:14px;font-family:'Noto Sans KR',sans-serif;
        min-width:180px;max-width:220px;
        border:1px solid rgba(255,255,255,0.1);
      ">
        <div style="font-size:11px;color:${dayColors[spot.day]};font-weight:700;letter-spacing:0.08em;margin-bottom:6px;">${spot.day}</div>
        <div style="font-size:14px;font-weight:700;margin-bottom:8px;">${spot.emoji} ${spot.name}</div>
        <div style="font-size:12px;color:#9CA3AF;line-height:1.6;white-space:pre-line;">${spot.desc}</div>
      </div>
    `;

    const infoWindow = new google.maps.InfoWindow({ content: infoContent });
    marker.addListener('click', () => infoWindow.open(map, marker));
  });

  // Legend
  const legend = document.createElement('div');
  legend.style.cssText = `
    background:rgba(17,24,39,0.95);border:1px solid rgba(255,255,255,0.1);
    border-radius:12px;padding:10px 14px;margin:8px;font-family:'Noto Sans KR',sans-serif;
    font-size:11px;color:#F9FAFB;
  `;
  legend.innerHTML = `
    <div style="font-weight:700;margin-bottom:8px;font-size:12px;">📍 일정별 스팟</div>
    <div style="display:flex;flex-direction:column;gap:5px;">
      <span><span style="color:#F4A7B9;">●</span> Day 1 — 핵심 벚꽃 스팟</span>
      <span><span style="color:#3B82F6;">●</span> Day 2 — 군항제 행사</span>
      <span><span style="color:#10B981;">●</span> Day 3 — 드라이브·숨은 명소</span>
    </div>
  `;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
}

// ===== Initialize Both Maps =====
function initMaps() {
  initDriveMap();
  initSpotMap();
}

window.initMaps = initMaps;
