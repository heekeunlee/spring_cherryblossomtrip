// ===== Google Maps 설정 (밝은 벚꽃 스타일) =====
const MAPS_CONFIG = {
  darkStyle: [
    { elementType: "geometry", stylers: [{ color: "#f9f0f2" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f9f0f2" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#7a4050" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#c94565" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#9a5060" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#daf0e0" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#3a8c5a" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#f0dce0" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a6a70" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#ffd0a0" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#f0b070" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#7a4020" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#f0e0e4" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#c94565" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8ddf0" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4a8ab0" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#d0ecf8" }] },
  ]
};

// ===== 드라이브 경로 지도 (수원 → 창원) =====
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

  const waypoints = [
    { lat: 37.2636, lng: 127.0286, label: '🏠 수원 출발', color: '#F4A7B9' },
    { lat: 36.9022, lng: 127.1467, label: '☕ 망향휴게소\n대표 메뉴: 망향비빔국수', color: '#F59E0B' },
    { lat: 35.9103, lng: 127.7189, label: '☕ 덕유산휴게소\n대표 메뉴: 도토리묵밥', color: '#F59E0B' },
    { lat: 35.1541, lng: 128.6980, label: '🌸 진해·창원 도착', color: '#10B981' },
  ];

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
        font-size:13px;min-width:160px;line-height:1.7;
        border:1px solid rgba(255,255,255,0.1);white-space:pre-line;
      ">${wp.label}</div>`,
    });

    marker.addListener('click', () => infoWindow.open(map, marker));
    if (i === 0 || i === waypoints.length - 1) {
      infoWindow.open(map, marker);
    }
  });

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    polylineOptions: { strokeColor: '#F4A7B9', strokeOpacity: 0.8, strokeWeight: 4 },
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
    if (status === 'OK') directionsRenderer.setDirections(result);
  });
}

// ===== 진해 스팟 상세 지도 (17개 스팟, 5개 카테고리) =====
function initSpotMap() {
  const mapEl = document.getElementById('spot-map-canvas');
  if (!mapEl) return;

  const map = new google.maps.Map(mapEl, {
    zoom: 13,
    center: { lat: 35.158, lng: 128.685 },
    styles: MAPS_CONFIG.darkStyle,
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: 'cooperative',
  });

  // 카테고리별 색상
  const CAT = {
    '🌸 벚꽃 명소': '#F4A7B9',
    '🎪 군항제 행사': '#A78BFA',
    '🏔️ 전망·드라이브': '#34D399',
    '🍽️ 맛집': '#FBBF24',
    '🌊 해안·자연': '#60A5FA',
  };

  const spots = [
    // ── 벚꽃 핵심 명소 ──────────────────────────
    {
      lat: 35.1723, lng: 128.6923,
      name: '경화역 플랫폼', cat: '🌸 벚꽃 명소',
      emoji: '🚉', day: '1일차',
      time: '08:00~09:30 (이른 방문 필수)',
      desc: '폐역 플랫폼 위 벚꽃 터널+기찻길 조합. 국내 최고 포토 스팟. 10시 이후 극혼잡. 24시간 개방.',
      crowded: '★★★★★', tip: '💡 08시 이전 방문 강력 추천',
    },
    {
      lat: 35.1581, lng: 128.7012,
      name: '여좌천 로망스다리', cat: '🌸 벚꽃 명소',
      emoji: '🌉', day: '1일차',
      time: '08:00~09:00 / 야경 20:30+',
      desc: 'TV 드라마 촬영지. 개천 양쪽 벚꽃 아치+수면 반영. 군항제 기간 야간 조명 21~22시 운영.',
      crowded: '★★★★★', tip: '💡 야경도 낮 못지않게 아름다움',
    },
    {
      lat: 35.1600, lng: 128.6835,
      name: '여좌천 벚꽃길 (전체)', cat: '🌸 벚꽃 명소',
      emoji: '🌸', day: '1일차',
      time: '종일 / 야경 20:30~22:00',
      desc: '로망스다리에서 상류 방향 1km 이상 이어지는 벚꽃 수로. 천천히 걸으며 감상하기 최적.',
      crowded: '★★★★☆', tip: '💡 상류로 갈수록 사람이 적어짐',
    },
    {
      lat: 35.1740, lng: 128.6870,
      name: '경화시장', cat: '🌸 벚꽃 명소',
      emoji: '🛒', day: '1일차',
      time: '09:00~18:00',
      desc: '경화역 인근 전통시장. 시장 골목 지붕 위로 벚꽃이 뒤덮여 독특한 풍경 연출. 로컬 분식·국수 저렴.',
      crowded: '★★★☆☆', tip: '💡 벚꽃 시장 분위기+가성비 간식',
    },
    {
      lat: 35.1560, lng: 128.7050,
      name: '안민고개 벚꽃 터널', cat: '🌸 벚꽃 명소',
      emoji: '🌲', day: '2일차',
      time: '10:00~18:00 (차량 이동)',
      desc: '진해→창원 방향 왕복 드라이브. 도로 양쪽 빼곡한 벚꽃 터널. 중간 전망 포인트 하차 가능. 왕복 30~40분.',
      crowded: '★★★★☆', tip: '💡 주말 오전 차량 정체 주의',
    },
    // ── 군항제 행사 ──────────────────────────────
    {
      lat: 35.1545, lng: 128.6929,
      name: '중원로터리', cat: '🎪 군항제 행사',
      emoji: '🎪', day: '1일차',
      time: '09:00~22:00 (야간 조명까지)',
      desc: '군항제 메인 광장. 해군 군악대 퍼레이드, 포토존 밀집. 점심 12~13시 최혼잡.',
      crowded: '★★★★★', tip: '💡 09:30 또는 17시 이후 방문 추천',
    },
    {
      lat: 35.1530, lng: 128.6880,
      name: '북원광장', cat: '🎪 군항제 행사',
      emoji: '🎭', day: '2일차',
      time: '10:00~21:00',
      desc: '플리마켓, 경남 특산물 장터, 사진·미술 전시. 군항제 문화 행사 중심지.',
      crowded: '★★★★☆', tip: '💡 카드 결제 안 되는 노점도 있음',
    },
    {
      lat: 35.1383, lng: 128.6956,
      name: '해군사관학교', cat: '🎪 군항제 행사',
      emoji: '⚓', day: '2일차',
      time: '09:00~17:00 (군항제 기간만 개방)',
      desc: '연 1회 군항제에만 개방. 내부 정원+벚꽃 절경. 사진 촬영 일부 제한. 개방 여부 창원시청 확인 필수!',
      crowded: '★★★☆☆', tip: '💡 09시 개방 직후 입장 추천',
    },
    {
      lat: 35.1420, lng: 128.6990,
      name: '진해항 군항부두', cat: '🎪 군항제 행사',
      emoji: '🚢', day: '2일차',
      time: '당해 일정 별도 확인',
      desc: '해군 함정 공개 및 승선 체험. 군항제 기간 일부 날짜만 운영. 창원시청 공식 공지 필수 확인.',
      crowded: '★★★★☆', tip: '💡 대기 줄 매우 길 수 있음',
    },
    // ── 전망 & 드라이브 ──────────────────────────
    {
      lat: 35.1553, lng: 128.6893,
      name: '진해루 전망대', cat: '🏔️ 전망·드라이브',
      emoji: '🏯', day: '1일차',
      time: '상시 개방 / 황금빛 뷰: 16:30',
      desc: '중원로터리에서 도보 10분 오르막. 진해 시내+벚꽃 파노라마 전경. 무료 입장. 16:30 황금빛 뷰.',
      crowded: '★★★☆☆', tip: '💡 석양 무렵이 가장 아름다움',
    },
    {
      lat: 35.1759, lng: 128.6551,
      name: '장복산 공원', cat: '🏔️ 전망·드라이브',
      emoji: '⛰️', day: '3일차',
      time: '07:30~ / 케이블카 09:00~17:00',
      desc: '진해만·마산만 바다 조망+벚꽃. 산책로 왕복 약 1시간. 케이블카 이용 가능(유료). 이른 아침 한산.',
      crowded: '★★☆☆☆', tip: '💡 07:30 이른 방문시 인파 없음',
    },
    {
      lat: 35.1490, lng: 128.6650,
      name: '진해 해안도로', cat: '🏔️ 전망·드라이브',
      emoji: '🚗', day: '3일차',
      time: '드라이브 약 30분',
      desc: '진해→마산 방면 해안 드라이브. 바다+봄꽃 동시 감상. 중간 내려서 바다 뷰 감상 추천.',
      crowded: '★★☆☆☆', tip: '💡 차 세울 공간 사전 확인 후 이동',
    },
    // ── 해안 & 자연 ──────────────────────────────
    {
      lat: 35.1680, lng: 128.6800,
      name: '진해만 생태숲', cat: '🌊 해안·자연',
      emoji: '🌿', day: '3일차',
      time: '09:00~18:00',
      desc: '관광객이 적은 조용한 벚꽃 숲. 생태탐방로 약 1.5km. 피크닉 명소. 주차 가능. 혼잡 최소.',
      crowded: '★★☆☆☆', tip: '💡 혼잡 피해 여유롭게 꽃 감상',
    },
    {
      lat: 35.1300, lng: 128.6800,
      name: '진해 명동 해안산책로', cat: '🌊 해안·자연',
      emoji: '🌊', day: '2~3일차',
      time: '상시 개방',
      desc: '진해만 해안을 따라 이어지는 산책로. 봄 바다+벚꽃의 조합. 낚시 포인트, 조용한 드라이브.',
      crowded: '★★☆☆☆', tip: '💡 노을 질 무렵 드라이브 추천',
    },
    // ── 맛집 ─────────────────────────────────────
    {
      lat: 35.1555, lng: 128.6945,
      name: '중원로터리 골목 맛집가', cat: '🍽️ 맛집',
      emoji: '🍜', day: '1일차 점심',
      time: '11:00~14:00 (12시 전 입장 추천)',
      desc: '해물뚝배기 약 1만원, 백반 8천~1만원. 광장 포장마차 기피, 골목 2~3개 안쪽 로컬 식당으로.',
      crowded: '★★★★★', tip: '💡 12시 넘으면 대기 1시간+',
    },
    {
      lat: 35.1038, lng: 128.5773,
      name: '마산 오동동 아구찜 골목', cat: '🍽️ 맛집',
      emoji: '🌶️', day: '2일차 저녁',
      time: '17:00~21:00',
      desc: '마산 향토 대표. 아귀+콩나물+미나리 얼큰. 2~3만원/인. 전문점들이 골목 집결.',
      crowded: '★★★☆☆', tip: '💡 진해서 차 25분. 저녁 18시 전 입장',
    },
    {
      lat: 35.1020, lng: 128.5840,
      name: '마산 어시장', cat: '🍽️ 맛집',
      emoji: '🦀', day: '3일차 점심',
      time: '08:00~17:00',
      desc: '신선 횟감 직거래. 포장 후 인근 식당 공간 이용. 3~5만원/인. 귀가 전 마지막 가성비 식사.',
      crowded: '★★★☆☆', tip: '💡 오전 일찍 방문시 가장 신선',
    },
  ];

  const catColors = {};
  Object.keys(CAT).forEach(k => { catColors[k] = CAT[k]; });

  let openInfoWindow = null;

  spots.forEach((spot) => {
    const color = CAT[spot.cat] || '#F4A7B9';
    const isPrimary = spot.cat === '🌸 벚꽃 명소' || spot.cat === '🎪 군항제 행사';

    const marker = new google.maps.Marker({
      position: { lat: spot.lat, lng: spot.lng },
      map,
      icon: {
        path: 'M 0,-15 C -8,-15 -13,-9 -13,0 C -13,8 -7,14 0,20 C 7,14 13,8 13,0 C 13,-9 8,-15 0,-15 Z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#060810',
        strokeWeight: 2,
        scale: isPrimary ? 1.1 : 0.85,
        anchor: new google.maps.Point(0, 20),
        labelOrigin: new google.maps.Point(0, 0),
      },
      label: { text: spot.emoji, fontSize: isPrimary ? '13px' : '11px' },
      title: spot.name,
      zIndex: isPrimary ? 10 : 5,
    });

    const crowdHtml = `
      <div style="display:flex;align-items:center;gap:6px;margin-top:8px;">
        <span style="font-size:10px;color:#6B7280;">혼잡도</span>
        <span style="font-size:11px;color:#F59E0B;">${spot.crowded}</span>
      </div>`;

    const infoContent = `
      <div style="
        background:#111827;color:#F9FAFB;padding:16px;border-radius:14px;
        font-family:'Noto Sans KR',sans-serif;
        min-width:210px;max-width:270px;
        border:1px solid ${color}55;
        box-shadow:0 4px 24px rgba(0,0,0,0.6);
      ">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
          <span style="font-size:10px;background:${color}22;color:${color};
            border:1px solid ${color}44;padding:2px 10px;border-radius:100px;
            font-weight:700;letter-spacing:0.04em;">${spot.cat}</span>
          <span style="font-size:10px;color:#6B7280;">${spot.day}</span>
        </div>
        <div style="font-size:15px;font-weight:800;margin-bottom:6px;">${spot.emoji} ${spot.name}</div>
        <div style="font-size:11px;color:${color};margin-bottom:8px;">🕐 ${spot.time}</div>
        <div style="font-size:12px;color:#9CA3AF;line-height:1.7;
          border-top:1px solid rgba(255,255,255,0.06);padding-top:8px;">${spot.desc}</div>
        ${crowdHtml}
        <div style="font-size:11px;color:#34D399;margin-top:8px;">${spot.tip}</div>
      </div>`;

    const infoWindow = new google.maps.InfoWindow({ content: infoContent });

    marker.addListener('click', () => {
      if (openInfoWindow) openInfoWindow.close();
      infoWindow.open(map, marker);
      openInfoWindow = infoWindow;
    });
  });

  // ── 범례 ──────────────────────────────────────
  const legend = document.createElement('div');
  legend.style.cssText = `
    background:rgba(10,14,26,0.92);backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.1);border-radius:14px;
    padding:14px 16px;margin:8px;font-family:'Noto Sans KR',sans-serif;
    font-size:11px;color:#F9FAFB;min-width:170px;
  `;
  legend.innerHTML = `
    <div style="font-weight:800;font-size:12px;margin-bottom:10px;color:#F4A7B9;">📍 스팟 분류 (${spots.length}개)</div>
    ${Object.entries(CAT).map(([cat, color]) =>
    `<div style="display:flex;align-items:center;gap:8px;margin-bottom:7px;">
        <span style="width:10px;height:10px;border-radius:50%;
          background:${color};flex-shrink:0;display:inline-block;"></span>
        <span style="color:#D1D5DB;">${cat}</span>
       </div>`
  ).join('')}
    <div style="margin-top:10px;font-size:10px;color:#6B7280;
      border-top:1px solid rgba(255,255,255,0.06);padding-top:8px;">
      마커 클릭 → 상세 정보 확인
    </div>`;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
}

// ===== 지도 초기화 =====
function initMaps() {
  initDriveMap();
  initSpotMap();
}

window.initMaps = initMaps;
