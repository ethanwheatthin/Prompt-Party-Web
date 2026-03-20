// Shared utilities and WebSocket helpers for all player pages

var PlayerSession = {
  save: function(data){
    sessionStorage.setItem('pp_token', data.token);
    sessionStorage.setItem('pp_playerId', data.playerId);
    sessionStorage.setItem('pp_roomCode', data.roomCode);
  },
  load: function(){
    return {
      token: sessionStorage.getItem('pp_token'),
      playerId: sessionStorage.getItem('pp_playerId'),
      roomCode: sessionStorage.getItem('pp_roomCode')
    };
  },
  clear: function(){
    sessionStorage.removeItem('pp_token');
    sessionStorage.removeItem('pp_playerId');
    sessionStorage.removeItem('pp_roomCode');
  },
  storeRoundData: function(data){
    sessionStorage.setItem('pp_roundData', JSON.stringify(data));
  },
  loadRoundData: function(){
    try { return JSON.parse(sessionStorage.getItem('pp_roundData')); } catch(e){ return null; }
  }
};

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c];
  });
}

function setMessageIn(container, text, type){
  container.innerHTML = '';
  if(!text) return;
  var div = document.createElement('div');
  div.className = type === 'error' ? 'error' : 'success';
  div.textContent = text;
  container.appendChild(div);
}

function openWebSocket(token, onMessage, onClose){
  var host = window.location.origin.replace(/^http/, 'ws');
  var ws = new WebSocket(host + '/ws');

  ws.onopen = function(){
    ws.send(JSON.stringify({ type: 'auth', payload: { token: token } }));
  };

  ws.onmessage = function(ev){
    try {
      var msg = JSON.parse(ev.data);
      onMessage(msg);
    } catch(e){}
  };

  ws.onclose = function(){
    if(onClose) onClose();
  };

  ws.onerror = function(){};

  return ws;
}
