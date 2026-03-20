(function(){
  var session = PlayerSession.load();
  if(!session.token){
    window.location.href = 'player.html';
    return;
  }

  var playerId = session.playerId;
  var topicDisplay = document.getElementById('topicDisplay');
  var timerDisplay = document.getElementById('timerDisplay');
  var timerBox = document.getElementById('timerBox');
  var actorBanner = document.getElementById('actorBanner');
  var promptForm = document.getElementById('promptForm');
  var promptInput = document.getElementById('promptInput');
  var submitPromptBtn = document.getElementById('submitPromptBtn');
  var promptMessage = document.getElementById('promptMessage');
  var votingArea = document.getElementById('votingArea');
  var votingTimer = document.getElementById('votingTimer');
  var promptsList = document.getElementById('promptsList');
  var votingMessage = document.getElementById('votingMessage');
  var selectedPromptArea = document.getElementById('selectedPromptArea');
  var selectedPromptText = document.getElementById('selectedPromptText');
  var selectedPromptAuthor = document.getElementById('selectedPromptAuthor');
  var resultsTopic = document.getElementById('resultsTopic');
  var resultsActor = document.getElementById('resultsActor');

  var ws = null;
  var currentRound = null;
  var timerInterval = null;
  var votingTimerInterval = null;
  var hasVoted = false;
  var votingEndTime = null;

  // Load initial round data stored by lobby before navigating here
  var initialRound = PlayerSession.loadRoundData();
  if(initialRound){
    showRound(initialRound);
  }

  // Connect WebSocket for live updates
  ws = openWebSocket(session.token, function(msg){
    if(msg.type === 'auth_ok'){
      // Connected successfully
    } else if(msg.type === 'auth_error'){
      PlayerSession.clear();
      window.location.href = 'player.html';
    } else if(msg.type === 'round_started'){
      showRound(msg.payload);
    } else if(msg.type === 'prompt_accepted'){
      submitPromptBtn.disabled = true;
      submitPromptBtn.textContent = 'SUBMITTED!';
      promptInput.disabled = true;
      setMessageIn(promptMessage, 'Prompt submitted! Waiting for others...', 'success');
    } else if(msg.type === 'voting_started'){
      showSplashScreen(msg.payload);
    } else if(msg.type === 'vote_accepted'){
      hasVoted = true;
      setMessageIn(votingMessage, 'Vote locked in! Waiting for others...', 'success');
    } else if(msg.type === 'prompt_selected'){
      handlePromptSelected(msg.payload);
    } else if(msg.type === 'error'){
      setMessageIn(promptMessage, msg.payload?.error || 'Server error', 'error');
      submitPromptBtn.disabled = false;
      submitPromptBtn.textContent = 'SEND IT!';
    }
  }, function(){
    setMessageIn(promptMessage, 'Disconnected from server', 'error');
  });

  function showRound(roundData){
    currentRound = roundData;
    hasVoted = false;
    selectedPromptArea.style.display = 'none';
    votingArea.style.display = 'none';
    topicDisplay.textContent = roundData.topic || 'Unknown topic';
    if(roundData.actorId === playerId){
      actorBanner.style.display = '';
      promptForm.style.display = 'none';
    } else {
      actorBanner.style.display = 'none';
      promptForm.style.display = '';
      submitPromptBtn.disabled = false;
      submitPromptBtn.textContent = 'SEND IT!';
      promptInput.disabled = false;
      promptInput.value = '';
    }
    setMessageIn(promptMessage, '');
    startTimer(roundData.maxEndAt);
  }

  function showSplashScreen(roundData){
    currentRound = roundData;
    var splash = document.createElement('div');
    splash.className = 'splash-screen';
    splash.innerHTML = '<div class="splash-content"><div class="splash-title">ALL PROMPTS IN!</div><div class="splash-subtitle">Get ready to vote...</div></div>';
    document.body.appendChild(splash);
    setTimeout(function(){
      splash.style.opacity = '0';
      splash.style.transition = 'opacity 0.5s ease-out';
      setTimeout(function(){
        document.body.removeChild(splash);
        handleVotingStarted(roundData);
      }, 500);
    }, 5000);
  }

  function handleVotingStarted(roundData){
    promptForm.style.display = 'none';
    if(roundData.actorId === playerId){
      actorBanner.style.display = '';
      actorBanner.textContent = 'YOU ARE THE ACTOR! PLAYERS ARE VOTING...';
      votingArea.style.display = 'none';
      return;
    }
    votingArea.style.display = '';
    votingEndTime = Date.now() + 60000;
    startVotingTimer();
    promptsList.innerHTML = '';
    var prompts = roundData.prompts || [];
    prompts.forEach(function(prompt){
      var promptCard = document.createElement('div');
      promptCard.className = 'vote-card';

      var promptText = document.createElement('div');
      promptText.className = 'vote-card-text';
      promptText.textContent = '\u201C' + prompt.text + '\u201D';

      var authorText = document.createElement('div');
      authorText.className = 'vote-card-author';
      authorText.textContent = 'by ' + escapeHtml(prompt.playerName);

      promptCard.appendChild(promptText);
      promptCard.appendChild(authorText);

      if(prompt.playerId === playerId){
        promptCard.classList.add('disabled');
        authorText.textContent = 'BY YOU (CANNOT VOTE FOR OWN)';
      } else {
        promptCard.addEventListener('click', function(){
          if(hasVoted) return;
          voteForPrompt(prompt.playerId, promptCard);
        });
      }
      promptsList.appendChild(promptCard);
    });
  }

  function startVotingTimer(){
    if(votingTimerInterval) clearInterval(votingTimerInterval);
    votingTimerInterval = setInterval(function(){
      var timeRemaining = votingEndTime - Date.now();
      if(timeRemaining <= 0){
        votingTimer.textContent = '0:00';
        votingTimer.style.color = '#ff66b2';
        clearInterval(votingTimerInterval);
        return;
      }
      var seconds = Math.floor(timeRemaining / 1000);
      var minutes = Math.floor(seconds / 60);
      var secs = seconds % 60;
      votingTimer.textContent = minutes + ':' + secs.toString().padStart(2, '0');
      votingTimer.style.color = timeRemaining <= 10000 ? '#ff66b2' : '#000';
    }, 100);
  }

  function voteForPrompt(promptPlayerId, cardElement){
    if(hasVoted) return;
    if(ws && ws.readyState === WebSocket.OPEN){
      ws.send(JSON.stringify({ type: 'submit_vote', payload: { promptPlayerId: promptPlayerId } }));
      cardElement.classList.add('selected');
      document.querySelectorAll('.vote-card').forEach(function(c){
        if(c !== cardElement) c.classList.add('disabled');
      });
      setMessageIn(votingMessage, 'Vote locked in!', 'success');
    }
  }

  function handlePromptSelected(data){
    if(votingTimerInterval) clearInterval(votingTimerInterval);
    votingArea.style.display = 'none';
    actorBanner.style.display = 'none';
    selectedPromptArea.style.display = '';
    var actorName = data.actorName || 'Unknown Actor';
    var topic = data.topic || (currentRound ? currentRound.topic : 'Unknown Topic');
    resultsTopic.textContent = 'Topic: \u201C' + topic + '\u201D';
    selectedPromptText.textContent = '\u201C' + data.promptText + '\u201D';
    selectedPromptAuthor.textContent = 'by ' + data.playerName + ' \u2022 ' + data.votes + ' vote' + (data.votes !== 1 ? 's' : '');
    resultsActor.textContent = 'ACTOR: ' + actorName;
    if(data.promptPlayerId === playerId){
      var winBadge = document.createElement('div');
      winBadge.className = 'result-winner';
      winBadge.textContent = 'YOUR PROMPT WON!';
      selectedPromptAuthor.after(winBadge);
    }
  }

  function startTimer(maxEndAt){
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function(){
      var timeRemaining = maxEndAt - Date.now();
      if(timeRemaining <= 0){
        timerDisplay.textContent = '0:00';
        timerBox.classList.add('urgent');
        clearInterval(timerInterval);
        return;
      }
      var seconds = Math.floor(timeRemaining / 1000);
      var minutes = Math.floor(seconds / 60);
      var secs = seconds % 60;
      timerDisplay.textContent = minutes + ':' + secs.toString().padStart(2, '0');
      if(timeRemaining <= 10000) timerBox.classList.add('urgent');
      else timerBox.classList.remove('urgent');
    }, 100);
  }

  submitPromptBtn.addEventListener('click', function(){
    var prompt = promptInput.value.trim();
    if(!prompt){ setMessageIn(promptMessage, 'Please enter a prompt', 'error'); return; }
    if(ws && ws.readyState === WebSocket.OPEN){
      ws.send(JSON.stringify({ type: 'submit_prompt', payload: { prompt: prompt } }));
      submitPromptBtn.disabled = true;
      submitPromptBtn.textContent = 'SENDING...';
    } else {
      setMessageIn(promptMessage, 'Not connected to server', 'error');
    }
  });
})();
