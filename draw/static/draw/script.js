var url = window.location.href;
console.log(url);
wssurl = url.replace("https", "wss");
wssurl = wssurl.replace("http", "ws");
wssurl = wssurl.replace("draw/", "ws\/draw");
console.log(wssurl);

// setting up the canvas and one paper tool
var aval_col;
var event_desc_col
var ws = new WebSocket(wssurl);
var myClientID = Math.random();
var timeStampArr = []; // A list of timestamps, cursed.
var dataDict = {}; // For now it stores everything, indexed by timestamps. Cursed :(.

// notify console if socket closes unexpectedly
ws.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

window.onload = function() {
  console.log("Loaded!");
  // TODO: use id for unique elements?
  aval_container = document.getElementsByClassName('calendar-container')[0];
  event_desc_col = document.getElementsByClassName('event-description-col')[0];
  cal_container_height = aval_container.clientHeight;
  console.log(cal_container_height);
  init();

  ws.onmessage = function(receivedMessage) {
    //console.log(receivedMessage.data);
    msg = JSON.parse(receivedMessage.data)
    sender = msg["sender"];
    if (sender != myClientID) {
      newPath = msg["newPath"];
    }
  };

  function init() {
    console.log("?");
    addParticipant("CLICK ME", null, 9, 18);
    for (i = 0; i < 20; i++) {
      addParticipant("Person#" + i, null, 8+getRandomInt(5), 19-getRandomInt(5));
    }
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function addParticipant(username, avatar, start_time, end_time) {
    let p_cont = document.createElement("div");
    p_cont.className = "participant-container";
    /* Insert the newly created col into the big calendar/container. */

    let profile = document.createElement("div");
    profile.className = "profile";
    profile.innerHTML = username;

    let cal_col = document.createElement("div");
    cal_col.className = "availability-calendar-col";

    let time_span = document.createElement("div");
    time_span.className = "time_span";
    start_height = cal_container_height * (start_time - 8) / 12; // Assume it's 3hr / (8am~8pm) -> starts at 11am
    height = cal_container_height * (end_time - start_time) / 12; // 8am+6hr = 2pm
    bg_color = '#F4A7B9';
    time_span.style.cssText = 'margin-top:' + start_height + 'px;background:' + bg_color + ';height:' + height + 'px;'
    
    aval_container.appendChild(p_cont);
      p_cont.appendChild(profile);
      p_cont.appendChild(cal_col);
        cal_col.appendChild(time_span);
  }
}
