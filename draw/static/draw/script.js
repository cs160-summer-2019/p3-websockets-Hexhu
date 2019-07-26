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
var data_dict = {}; // For now it stores everything, indexed by timestamps. Cursed :(.
var arrival_info_dict = {}

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
    timestamp = msg["timestamp"];
    if (sender != myClientID) {
      switch (msg["type"]) {
        case "arrival_status":
          console.log(msg);
          let arr_info = msg["payload"].split(',');
          console.log(arr_info);
          // Update arrival status.
          if (!(sender in arrival_info_dict)) {
            addParticipant(arr_info[0], arr_info[1], arr_info[2], arr_info[3], sender, false);
            arrival_info_dict[sender] = {};
            arrival_info_dict[sender][timestamp] = arr_info;
          } else {
            let max_timestamp = arrival_info_dict[sender][arrival_info_dict[sender].length - 1];
            if (timestamp > max_timestamp) {
              // Do update
              console.log("Updating arrivals info for user" + sender);
              arrival_info_dict[sender][timestamp] = arr_info;
              updateParticipantInfo(arr_info[0], arr_info[1], arr_info[2], arr_info[3], sedner, false);
            }
          }
          break;
        case "idea_vote":
          // Vote for an idea (a restaurant, for example).
          break;
        case "chat":
          // An incoming chat message.
          break;
      }
    }
  };

  function init() {
    console.log("?");
    addParticipant("CLICK ME", null, 9, 18);
    /*for (i = 0; i < 2; i++) {
      addParticipant("Person#" + i, null, 8+getRandomInt(5), 19-getRandomInt(5));
    }*/
  }


  function updateParticipantInfo(username, avatar, start_time, end_time, userid=myClientID, notifyOthers=false) {
    let p_cont = document.getElementById(userid);
    let c = p_cont.childNodes;
    for (i = 0; i < c.length; i++)
      console.log(userid + ": " + c[i].className);
  }

  function toggleArrivalStatusFieldVisibility() {
    let x = document.getElementsByClassName('arrival-status-row')[0];
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

}

function addParticipant(username, avatar, start_time, end_time, userid=myClientID, notifyOthers=false) {
  // If invalid time range, swap.
  if (start_time > end_time) {
    start_time = start_time + end_time;
    end_time = start_time - end_time;
    start_time = start_time - end_time;
  }
  let p_cont = document.createElement("div");
  p_cont.className = "participant-container";
  p_cont.id = userid;
  p_cont.onclick = function () {toggleArrivalStatusFieldVisibility()};
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
  
  if (notifyOthers) {
    let type = 'arrival_status'
    let action = 'update'
    let layload = [username, avatar, start_time, end_time]
    let marshaledJSON = '{"sender": "' + userid + '", "timestamp": "' + Math.floor(Date.now() / 1000) + '", "type": "' + type +'", "action": "' + action + '", "payload": "' + layload + '", "data_dict": "' + data_dict + '"}';
    ws.send(marshaledJSON);
  }
}

// Called when submitting forms
function handleArrStatusUpdate(content) {
  console.log(content);
  for (i = 0; i < 2; i++) {
    addParticipant("Person#" + i, null, 8+getRandomInt(5), 19-getRandomInt(5), notifyOthers=true);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}