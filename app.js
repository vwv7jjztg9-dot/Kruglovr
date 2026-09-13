const M=[
{id:1,title:"Начало охоты",place:"Красная площадь",lat:55.7539,lng:37.6208,xp:50,story:"Добро пожаловать в Москву, которой больше не видно с первого взгляда. Сегодня тебе предстоит найти 10 следов прошлого.",task:"Найди глазами объект на площади, который видел Москву задолго до большинства современных зданий.",kind:"observe"},
{id:2,title:"Посмотри вверх",place:"Варварка",lat:55.7522,lng:37.6258,xp:100,story:"Улица получила своё название от храма Святой Варвары.",task:"Почему улица называется Варваркой?",kind:"quiz",answers:["В честь варягов","В честь Святой Варвары","Это была дорога варягов"],correct:1},
{id:3,title:"След иностранцев",place:"Старый Английский двор",lat:55.7520,lng:37.6267,xp:200,story:"Здесь Москва встречалась с иностранным торговым миром.",task:"Какую роль Старый Английский двор играл в истории Москвы?",kind:"quiz",answers:["Военную крепость","Торговое представительство","Царскую резиденцию","Религиозный центр"],correct:1,secret:true},
{id:4,title:"Дом, из которого вышла династия",place:"Палаты бояр Романовых",lat:55.7526,lng:37.6270,xp:100,story:"С этим местом связана история рода Романовых.",task:"Как звали первого царя из династии Романовых?",kind:"quiz",answers:["Иван","Алексей","Михаил","Фёдор"],correct:2},
{id:5,title:"Найди лишнее",place:"Знаменский монастырь",lat:55.7530,lng:37.6264,xp:75,story:"Перед тобой ансамбль зданий разных эпох.",task:"Найди на месте деталь, которая визуально выбивается по эпохе.",kind:"observe"},
{id:6,title:"Город, которого больше нет",place:"Зарядье",lat:55.7521,lng:37.6285,xp:100,story:"До современного парка здесь существовал старый городской район, а в XX веке стояла гостиница «Россия».",task:"Что находилось здесь до современного парка?",kind:"quiz",answers:["Огромный рынок","Гостиница «Россия»","Императорский дворец"],correct:1},
{id:7,title:"Поймай три эпохи",place:"Парящий мост",lat:55.7508,lng:37.6250,xp:100,story:"Теперь ты смотришь на Москву сразу в нескольких временных слоях.",task:"Найди Кремль, Москву-реку и современную Москву. Нажми «Нашёл всё».",kind:"observe"},
{id:8,title:"Найди исчезнувшую Москву",place:"Китайгородская стена",lat:55.7557,lng:37.6274,xp:125,story:"Стена Китай-города была построена в 1535–1538 годах.",task:"Сопоставь современную карту с исторической линией стены.",kind:"observe"},
{id:9,title:"Анна в Углу",place:"Церковь Анны в Углу",lat:55.7547,lng:37.6286,xp:100,story:"Название храма связано с его положением у угла старой линии укреплений Китай-города.",task:"Почему храм называется «Анна в Углу»?",kind:"quiz",answers:["Из-за имени основателя","Из-за положения у угла стены","Из-за формы купола"],correct:1,secret:true},
{id:10,title:"Охотник за Москвой",place:"Финал",lat:55.7547,lng:37.6286,xp:150,story:"Ты прошёл маршрут и увидел Москву сразу в нескольких эпохах.",task:"Охота завершена.",kind:"finish"}
];

const DEFAULT={mission:0,xp:0,secrets:0,paid:false};
let s=loadState();
let user=null,map=null,userMarker=null;
const app=document.getElementById("app");

function loadState(){
  try{return {...DEFAULT,...JSON.parse(localStorage.getItem("cq02")||"{}")}}
  catch(e){return {...DEFAULT}}
}
function save(){localStorage.setItem("cq02",JSON.stringify(s))}
function resetProgress(){
  if(confirm("Сбросить весь прогресс?")){
    s={...DEFAULT}; save(); render();
  }
}
function shell(c){
  app.innerHTML=`<main class="shell">
    <header class="top"><div class="brand">CITY QUEST</div><div class="xp">${s.xp} XP</div></header>
    ${c}
    <footer class="footer">CITY QUEST · MVP v0.2</footer>
  </main>`;
}
function home(){
  shell(`<section class="hero">
    <div class="eyebrow">ПЕРВАЯ ОХОТА</div>
    <h1>Тайны<br>старой Москвы</h1>
    <p class="lead">Пеший квест по историческому центру: карта, GPS, истории, загадки, секреты и XP.</p>
    <div class="card">
      <div class="cover"><span>МОСКВА</span><b>10</b><small>МИССИЙ</small></div>
      <div class="meta"><span class="pill">🚶 ~4 км</span><span class="pill">⏱ 1,5–2 часа</span><span class="pill">🔎 2 секрета</span></div>
      <button class="primary" onclick="start()">Начать охоту</button>
      <button class="link-btn" onclick="showAbout()">Как это работает</button>
    </div>
  </section>`);
}
function showAbout(){
  shell(`<div class="eyebrow">CITY QUEST</div><h1>Как это работает</h1>
  <div class="card">
    <div class="step"><b>1. Иди к точке</b><span>Карта показывает следующий объект.</span></div>
    <div class="step"><b>2. Читай и ищи</b><span>Короткая история + задание на месте.</span></div>
    <div class="step"><b>3. Собирай XP</b><span>Правильные ответы и найденные детали дают очки.</span></div>
    <div class="step"><b>4. Открой полный маршрут</b><span>Первые 3 миссии бесплатны, дальше — полный квест.</span></div>
    <button class="primary" onclick="home()">Назад</button>
  </div>`);
}
function start(){s={...DEFAULT};save();renderMap()}
function renderMap(){
  if(s.mission>=10){renderMission();return}
  const m=M[s.mission];
  shell(`<div class="eyebrow">МАРШРУТ · ${s.mission+1}/10</div>
    <h2>Тайны старой Москвы</h2>
    <div id="map" class="map"></div>
    <div class="map-note">📍 Золотые точки — миссии. GPS включается только после твоего разрешения.</div>
    <div class="card">
      <div class="eyebrow">СЛЕДУЮЩАЯ ТОЧКА</div>
      <h3>${m.place}</h3>
      <p>${distanceText()}</p>
      <button class="primary" onclick="openNext()">Открыть миссию</button>
      <button class="secondary" onclick="locate()">Определить моё местоположение</button>
      <button class="link-btn" onclick="resetProgress()">Сбросить прогресс</button>
    </div>`);
  initMap();
}
function initMap(){
  if(!window.L)return;
  map=L.map("map").setView([55.7539,37.6258],15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(map);
  M.forEach((m,i)=>{
    if(i<=Math.min(s.mission+1,9)){
      const marker=L.marker([m.lat,m.lng]).addTo(map);
      marker.bindPopup(`<b>${m.id}. ${m.place}</b>`);
    }
  });
  if(user) userMarker=L.marker([user.lat,user.lng]).addTo(map).bindPopup("Ты здесь");
}
function locate(){
  if(!navigator.geolocation){alert("Геолокация не поддерживается этим браузером.");return}
  navigator.geolocation.getCurrentPosition(
    p=>{user={lat:p.coords.latitude,lng:p.coords.longitude};renderMap()},
    ()=>alert("Не удалось получить GPS. Проверь разрешение браузера."),
    {enableHighAccuracy:true,timeout:10000,maximumAge:30000}
  );
}
function distanceText(){
  if(!user)return "Разреши GPS, чтобы увидеть расстояние до точки.";
  const d=dist(user.lat,user.lng,M[s.mission].lat,M[s.mission].lng);
  return d<1?`До точки примерно ${Math.round(d*1000)} м.`:`До точки примерно ${d.toFixed(1)} км.`;
}
function dist(a,b,c,d){
  const R=6371,rad=x=>x*Math.PI/180,x=rad(c-a),y=rad(d-b);
  const q=Math.sin(x/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(y/2)**2;
  return 2*R*Math.asin(Math.sqrt(q));
}
function openNext(){
  if(s.mission>=3&&!s.paid)return paywall();
  renderMission();
}
function renderMission(){
  const m=M[s.mission];
  if(!m)return renderMap();
  let c=`<div class="eyebrow">МИССИЯ ${m.id}/10 · ${m.place}</div>
    <h1 class="mission-title">${m.title}</h1>
    <div class="progress"><i style="width:${m.id*10}%"></i></div>
    <div class="card">
      <p class="story">${m.story}</p>
      <p class="question">${m.task}</p>`;
  if(m.kind==="quiz"){
    c+=`<div class="answers">${m.answers.map((a,i)=>`<button class="answer" onclick="answer(${i})">${String.fromCharCode(65+i)} — ${a}</button>`).join("")}</div>`;
  }else if(m.kind==="finish"){
    c+=`<div class="reward"><div class="big">🏆</div><h2>ОХОТНИК ЗА МОСКВОЙ</h2><p>10/10 миссий · ${s.secrets}/2 секрета · ${s.xp} XP</p></div>`;
  }else{
    c+=`<button class="primary" onclick="complete()">Нашёл / Готово</button>`;
  }
  c+=`</div><button class="secondary" onclick="renderMap()">К карте</button>`;
  shell(c);
}
function answer(i){
  if(i!==M[s.mission].correct){alert("Не угадал. Попробуй ещё раз.");return}
  complete();
}
function complete(){
  const m=M[s.mission];
  if(!m)return;
  s.xp+=m.xp;
  if(m.secret)s.secrets++;
  s.mission++;
  save();
  if(s.mission===3)return paywall();
  if(s.mission>=10)return renderMission();
  renderMap();
}
function paywall(){
  shell(`<div class="eyebrow">ТЫ ПРОШЁЛ БЕСПЛАТНУЮ ЧАСТЬ</div>
    <h1>3/10</h1>
    <p class="lead">Ты уже собрал <b>${s.xp} XP</b>. Открой ещё 7 миссий и доберись до финала.</p>
    <div class="card paywall">
      <div class="eyebrow">ПОЛНЫЙ МАРШРУТ</div>
      <div class="price">249 ₽</div>
      <p>7 миссий · 2 секрета · финальный achievement</p>
      <button class="primary" onclick="unlock()">Открыть маршрут</button>
      <p class="tiny">В MVP кнопка открывает доступ без реальной оплаты. Платёж подключим следующим этапом.</p>
    </div>
    <button class="secondary" onclick="renderMap()">Назад</button>`);
}
function unlock(){s.paid=true;save();renderMap()}
function render(){
  if(s.mission>=10)return renderMission();
  home();
}
render();
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
