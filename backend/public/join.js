(function(){
  var joinCodeInput = document.getElementById('joinCode');
  var nameInput = document.getElementById('name');
  var joinBtn = document.getElementById('joinBtn');
  var messageDiv = document.getElementById('message');

  function normalizeCode(code){
    return (code||'').trim().toUpperCase();
  }

  joinCodeInput.addEventListener('input', function(){
    joinCodeInput.value = normalizeCode(joinCodeInput.value).slice(0,10);
  });

  function checkAutoJoin(){
    var params = new URLSearchParams(window.location.search);
    var code = params.get('code');
    var name = params.get('name');
    var autoJoin = params.get('autoJoin');
    if(code && name && autoJoin === 'true'){
      joinCodeInput.value = code.toUpperCase();
      nameInput.value = name;
      setTimeout(function(){ joinRoom(); }, 500);
    }
  }

  async function joinRoom(){
    setMessageIn(messageDiv, '');
    var joinCode = normalizeCode(joinCodeInput.value);
    var name = (nameInput.value||'').trim().slice(0,20);
    if(!joinCode){ setMessageIn(messageDiv, 'Please enter a room code', 'error'); return; }
    if(!name){ setMessageIn(messageDiv, 'Please enter your name', 'error'); return; }

    joinBtn.disabled = true;
    joinBtn.textContent = 'JOINING...';

    try {
      var res = await fetch('/join', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ joinCode: joinCode, name: name })
      });
      if(res.status === 404){ setMessageIn(messageDiv, 'Room not found', 'error'); joinBtn.disabled = false; joinBtn.textContent = 'JOIN GAME'; return; }
      if(res.status === 400){ var body = await res.json(); setMessageIn(messageDiv, body.error || 'Bad request', 'error'); joinBtn.disabled = false; joinBtn.textContent = 'JOIN GAME'; return; }
      if(!res.ok){ setMessageIn(messageDiv, 'Network error', 'error'); joinBtn.disabled = false; joinBtn.textContent = 'JOIN GAME'; return; }

      var data = await res.json();
      PlayerSession.save({
        token: data.token,
        playerId: data.playerId,
        roomCode: data.joinCode || data.roomId
      });

      window.location.href = 'lobby.html';
    } catch(err){
      setMessageIn(messageDiv, 'Network error while joining', 'error');
    } finally {
      joinBtn.disabled = false;
      joinBtn.textContent = 'JOIN GAME';
    }
  }

  joinBtn.addEventListener('click', joinRoom);
  checkAutoJoin();
})();
