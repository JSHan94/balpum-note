'use strict';

const STORAGE_KEY = 'balpum-checklist-v2';
const sections = [
  { id: 'before', title: '가기 전', items: [
    ['register', '건축물대장에서 전용면적·위반 여부 확인'],
    ['land', '토지이음에서 정비구역·모아타운 확인'],
    ['trade', '같은 건물 실거래가 확인'],
    ['floorplan', '평면도·입주 가능일 미리 확인'],
    ['tools', '줄자와 손전등 챙기기']
  ]},
  { id: 'neighborhood', title: '동네', items: [
    ['station', '역까지 직접 걸어보기'],
    ['hill', '골목 경사와 계단 확인'],
    ['noiseout', '대로·상가·오토바이 소음 듣기'],
    ['light', '채광을 가리는 앞 건물 확인'],
    ['amenity', '마트·병원·공원 접근성 확인'],
    ['flood', '저지대·침수 위험 확인']
  ]},
  { id: 'building', title: '건물·주차', items: [
    ['parking', '내 차가 실제로 주차 가능한지 확인'],
    ['doublepark', '이중주차·선착순 배정 여부 확인'],
    ['elevator', '승강기 또는 계단 이동 부담 확인'],
    ['wall', '외벽 균열·누수 자국 확인'],
    ['roof', '꼭대기층이라면 옥상 방수 상태 확인'],
    ['common', '계단·현관·쓰레기장 관리 상태 확인'],
    ['shop', '1층 상가의 소음·냄새 확인']
  ]},
  { id: 'space', title: '실내 공간', items: [
    ['living', '거실 폭과 깊이 재보기'],
    ['rooms', '방 3개에 필요한 가구가 들어가는지 재보기'],
    ['layout', '복도 등 버려지는 공간 확인'],
    ['sun', '창 방향과 실제 햇빛 확인'],
    ['air', '앞뒤 창으로 맞통풍이 되는지 확인'],
    ['balcony', '발코니 확장 여부 확인'],
    ['structure', '철거하려는 벽이 내력벽인지 확인']
  ]},
  { id: 'condition', title: '하자·수리', items: [
    ['mold', '창틀·벽 모서리 곰팡이와 결로 확인'],
    ['leak', '천장·벽의 누수 흔적 확인'],
    ['water', '수압·배수·하수구 냄새 확인'],
    ['window', '창호 상태와 외풍 확인'],
    ['boiler', '보일러·배관 연식 확인'],
    ['electric', '차단기·콘센트 상태 확인'],
    ['sound', '층간·벽간 소음 듣기'],
    ['estimate', '수리 견적 2곳 이상 받아보기']
  ]},
  { id: 'contract', title: '관리·계약', items: [
    ['fee', '관리비와 공용 수리비 분담 확인'],
    ['repair', '옥상·외벽·배관 공사 이력 확인'],
    ['tenant', '세입자·보증금·입주일 확인'],
    ['defect', '누수·하자 이력과 계약 특약 확인'],
    ['violation', '불법 확장·이행강제금 여부 확인'],
    ['registry', '계약 전 등기부의 근저당·대지권 확인']
  ]},
  { id: 'revisit', title: '다시 확인', items: [
    ['evening', '평일 저녁 주차·소음 다시 보기'],
    ['guui', '평일 8시 구의역까지 40분 이내인지 확인'],
    ['dogok', '평일 8시 도곡역까지 40분 이내인지 확인'],
    ['rain', '비 오는 날 누수·배수 확인'],
    ['winter', '겨울 결로·외풍 확인']
  ]}
];

const allIds = new Set(sections.flatMap(section => section.items.map(([id]) => id)));
let checked;
try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  checked = new Set(Array.isArray(stored) ? stored.filter(id => allIds.has(id)) : []);
} catch {
  checked = new Set();
}

const list = document.getElementById('checklist');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const resetButton = document.getElementById('resetButton');

function render() {
  list.innerHTML = sections.map((section, index) => {
    const done = section.items.filter(([id]) => checked.has(id)).length;
    return `<section class="check-section" id="section-${index + 1}" aria-labelledby="heading-${section.id}">
      <div class="check-section-header"><h2 id="heading-${section.id}">${section.title}</h2><span class="section-count">${done} / ${section.items.length}</span></div>
      <ul class="check-list">${section.items.map(([id, label]) => `
        <li><label class="check-row${checked.has(id) ? ' is-checked' : ''}">
          <input class="check-box" type="checkbox" value="${id}" ${checked.has(id) ? 'checked' : ''}>
          <span class="check-label">${label}</span>
        </label></li>`).join('')}</ul>
    </section>`;
  }).join('');
  const count = checked.size;
  progressText.textContent = `${count} / ${allIds.size} 완료`;
  progressBar.style.width = `${Math.round(count / allIds.size * 100)}%`;
  progressBar.parentElement.setAttribute('aria-valuenow', String(count));
  progressBar.parentElement.setAttribute('aria-valuemax', String(allIds.size));
}

list.addEventListener('change', event => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !allIds.has(input.value)) return;
  if (input.checked) checked.add(input.value);
  else checked.delete(input.value);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked])); }
  catch { /* 저장이 차단돼도 현재 페이지의 체크는 사용할 수 있습니다. */ }
  render();
});

resetButton.addEventListener('click', () => {
  if (!checked.size) return;
  if (!window.confirm('모든 체크를 지울까요?')) return;
  checked.clear();
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
  render();
});

render();
