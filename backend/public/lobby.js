(function(){
  var session = PlayerSession.load();
  if(!session.token){
    window.location.href = 'player.html';
    return;
  }

  var roomCodeText = document.getElementById('roomCodeText');
  var playersList = document.getElementById('playersList');
  var lobbyMessage = document.getElementById('lobbyMessage');

  roomCodeText.textContent = session.roomCode;
  lobbyMessage.textContent = 'Connecting...';

  function updatePlayers(roomState){
    if(!roomState) return;
    playersList.innerHTML = '';
    var players = roomState.players || [];
    players.forEach(function(p){
      var li = document.createElement('li');
      var dot = document.createElement('div');
      dot.className = 'dot online';
      li.appendChild(dot);
      var span = document.createElement('div');
      span.className = 'small';
      span.textContent = p.name || p.id;
      li.appendChild(span);
      playersList.appendChild(li);
    });
  }

  var ws = openWebSocket(session.token, function(msg){
    if(msg.type === 'auth_ok'){
      lobbyMessage.textContent = 'Waiting for the host to start the chaos...';
      updatePlayers(msg.payload.roomState);
    } else if(msg.type === 'room_state'){
      updatePlayers(msg.payload);
    } else if(msg.type === 'auth_error'){
      lobbyMessage.textContent = 'Auth error: ' + (msg.payload?.error || '');
      PlayerSession.clear();
      setTimeout(function(){ window.location.href = 'player.html'; }, 2000);
    } else if(msg.type === 'round_started'){
      PlayerSession.storeRoundData(msg.payload);
      window.location.href = 'round.html';
    }
  }, function(){
    lobbyMessage.textContent = 'Disconnected from server';
    Array.from(playersList.children).forEach(function(li){
      var dot = li.querySelector('.dot');
      if(dot){ dot.classList.remove('online'); dot.classList.add('offline'); }
    });
  });
})();
