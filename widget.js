/*
 * NexusAI Sales Agent Widget v2.0
 * Host: https://phoenixmedia005-cpu.github.io/nexusai-widget/widget.js
 * Usage: <script src="https://phoenixmedia005-cpu.github.io/nexusai-widget/widget.js?widget_id=YOUR_ID"></script>
 */
(function() {
  if (window.__NEXUSAI_LOADED__) return;
  window.__NEXUSAI_LOADED__ = true;

  var scriptTag = document.currentScript || (function() {
    var s = document.getElementsByTagName('script');
    return s[s.length - 1];
  })();
  var src = scriptTag ? scriptTag.src : '';
  var params = new URLSearchParams(src.split('?')[1] || '');
  var WIDGET_ID  = window.__NEXUSAI_WIDGET_ID__ || params.get('widget_id') || 'default';
  var PRIMARY    = '#f97316';
  var AGENT_NAME = 'Nova';
  var sessionId  = 'sess_' + Math.random().toString(36).slice(2, 10);
  var messages   = [];
  var isOpen     = false;
  var isTyping   = false;

  /* ---- STYLES ---- */
  var css = document.createElement('style');
  css.textContent =
    '#nai-btn{position:fixed;bottom:24px;right:24px;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,'+PRIMARY+',#ec4899);border:none;cursor:pointer;box-shadow:0 4px 24px rgba(249,115,22,0.5);z-index:2147483647;display:flex;align-items:center;justify-content:center;font-size:26px;transition:transform .25s}' +
    '#nai-btn:hover{transform:scale(1.1)}' +
    '#nai-badge{position:absolute;top:-4px;right:-4px;width:18px;height:18px;background:#ef4444;border-radius:50%;font-size:10px;font-weight:700;display:none;align-items:center;justify-content:center;color:#fff}' +
    '#nai-box{position:fixed;bottom:96px;right:24px;width:350px;height:510px;background:#0f0f1a;border:1px solid rgba(255,255,255,0.1);border-radius:20px;box-shadow:0 24px 60px rgba(0,0,0,0.6);z-index:2147483646;display:none;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;overflow:hidden}' +
    '#nai-box.open{display:flex}' +
    '#nai-head{background:linear-gradient(135deg,'+PRIMARY+',#ec4899);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}' +
    '#nai-av{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;color:#fff;margin-right:10px}' +
    '#nai-nm{font-weight:700;font-size:14px;color:#fff}' +
    '#nai-st{font-size:11px;color:rgba(255,255,255,0.8)}' +
    '#nai-x{background:none;border:none;color:rgba(255,255,255,0.8);cursor:pointer;font-size:18px;padding:4px;line-height:1}' +
    '#nai-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px}' +
    '#nai-msgs::-webkit-scrollbar{width:3px}#nai-msgs::-webkit-scrollbar-thumb{background:#2a2a3a;border-radius:2px}' +
    '.nai-m{max-width:84%;padding:10px 13px;border-radius:14px;font-size:13px;line-height:1.55;word-wrap:break-word;white-space:pre-line;animation:nFade .2s ease}' +
    '.nai-m.bot{background:rgba(255,255,255,0.08);color:#e2e8f0;border-bottom-left-radius:3px;align-self:flex-start}' +
    '.nai-m.usr{background:linear-gradient(135deg,'+PRIMARY+',#ec4899);color:#fff;border-bottom-right-radius:3px;align-self:flex-end}' +
    '@keyframes nFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}' +
    '.nai-dots{display:flex;gap:5px;padding:10px 14px;background:rgba(255,255,255,0.08);border-radius:14px;border-bottom-left-radius:3px;align-self:flex-start}' +
    '.nai-dots span{width:7px;height:7px;background:rgba(255,255,255,0.35);border-radius:50%;animation:nDot 1.4s infinite}' +
    '.nai-dots span:nth-child(2){animation-delay:.2s}.nai-dots span:nth-child(3){animation-delay:.4s}' +
    '@keyframes nDot{0%,60%,100%{opacity:.3;transform:scale(.7)}30%{opacity:1;transform:scale(1)}}' +
    '#nai-form{padding:10px 12px;border-top:1px solid rgba(255,255,255,0.06);display:flex;gap:8px;flex-shrink:0}' +
    '#nai-inp{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;border-radius:10px;padding:9px 13px;font-size:13px;outline:none;font-family:inherit}' +
    '#nai-inp:focus{border-color:'+PRIMARY+'}' +
    '#nai-inp::placeholder{color:rgba(255,255,255,0.28)}' +
    '#nai-snd{background:linear-gradient(135deg,'+PRIMARY+',#ec4899);border:none;border-radius:10px;width:40px;height:40px;cursor:pointer;color:#fff;font-size:16px;flex-shrink:0}' +
    '#nai-snd:disabled{opacity:.4;cursor:not-allowed}' +
    '#nai-pw{text-align:center;padding:5px 0 6px;font-size:10px;color:rgba(255,255,255,0.18);flex-shrink:0}' +
    '#nai-pw a{color:rgba(255,255,255,0.3);text-decoration:none}';
  document.head.appendChild(css);

  /* ---- BUILD DOM ---- */
  var btn = document.createElement('button');
  btn.id = 'nai-btn';
  btn.innerHTML = '💬<span id="nai-badge">1</span>';

  var box = document.createElement('div');
  box.id = 'nai-box';
  box.innerHTML =
    '<div id="nai-head">' +
      '<div style="display:flex;align-items:center">' +
        '<div id="nai-av">N</div>' +
        '<div><div id="nai-nm">'+AGENT_NAME+'</div><div id="nai-st">🟢 Online — here to help</div></div>' +
      '</div>' +
      '<button id="nai-x">✕</button>' +
    '</div>' +
    '<div id="nai-msgs"></div>' +
    '<div id="nai-form">' +
      '<input id="nai-inp" placeholder="Type a message..." autocomplete="off" maxlength="500"/>' +
      '<button id="nai-snd">➤</button>' +
    '</div>' +
    '<div id="nai-pw">Powered by <a href="https://nexusai-site-phoenix.netlify.app" target="_blank">NexusAI</a></div>';

  document.body.appendChild(btn);
  document.body.appendChild(box);

  /* ---- EVENTS ---- */
  btn.onclick = function() { toggle(); };
  document.getElementById('nai-x').onclick = function() { close(); };
  document.getElementById('nai-snd').onclick = send;
  document.getElementById('nai-inp').onkeydown = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  function toggle() {
    isOpen = !isOpen;
    if (isOpen) {
      box.classList.add('open');
      btn.innerHTML = '✕';
      document.getElementById('nai-badge').style.display = 'none';
      if (messages.length === 0) setTimeout(greet, 350);
      setTimeout(function() { document.getElementById('nai-inp').focus(); }, 300);
    } else {
      close();
    }
  }

  function close() {
    box.classList.remove('open');
    isOpen = false;
    btn.innerHTML = '💬<span id="nai-badge" style="display:none">1</span>';
  }

  function greet() {
    addBot('Hi there! 👋 I\'m ' + AGENT_NAME + ', your AI sales assistant.');
    setTimeout(function() {
      addBot('What brings you here today? I can help with:\n• Product info & pricing\n• Scheduling a demo\n• Custom quotes\n• General questions');
    }, 700);
  }

  function addBot(t) { messages.push({role:'assistant',content:t}); renderMsg(t,'bot'); }
  function addUser(t) { messages.push({role:'user',content:t}); renderMsg(t,'usr'); }

  function renderMsg(text, cls) {
    var el = document.createElement('div');
    el.className = 'nai-m ' + cls;
    el.textContent = text;
    document.getElementById('nai-msgs').appendChild(el);
    scroll();
  }

  function showDots() {
    var d = document.createElement('div');
    d.className = 'nai-dots'; d.id = 'nai-dots';
    d.innerHTML = '<span></span><span></span><span></span>';
    document.getElementById('nai-msgs').appendChild(d);
    scroll();
  }

  function hideDots() {
    var d = document.getElementById('nai-dots');
    if (d) d.remove();
  }

  function scroll() {
    var el = document.getElementById('nai-msgs');
    setTimeout(function() { el.scrollTop = el.scrollHeight; }, 50);
  }

  function send() {
    var inp = document.getElementById('nai-inp');
    var snd = document.getElementById('nai-snd');
    var txt = inp.value.trim();
    if (!txt || isTyping) return;
    inp.value = '';
    addUser(txt);
    isTyping = true;
    snd.disabled = true;
    showDots();
    // Simulate thinking delay then reply
    setTimeout(function() {
      hideDots();
      var reply = getReply(txt, messages);
      addBot(reply);
      isTyping = false;
      snd.disabled = false;
      inp.focus();
    }, 900 + Math.random() * 600);
  }

  /* ---- SMART QUALIFICATION ENGINE ---- */
  function getReply(msg, hist) {
    var m = msg.toLowerCase();
    var turn = hist.filter(function(h){ return h.role==='user'; }).length;
    var allText = hist.map(function(h){ return h.content; }).join(' ') + ' ' + msg;

    // Email detected
    var emailMatch = allText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
    if (msg.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)) {
      return 'Perfect, got your email! ✅ Our team will reach out within 24 hours. Is there anything specific you\'d like them to prepare for you?';
    }

    // Name detected in this message
    var nameMatch = msg.match(/(?:i(?:\'m| am)|my name(?:\'s| is)?|call me)\s+([A-Z][a-z]+)/i) ||
                   (turn <= 2 && msg.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)$/));
    if (nameMatch) {
      var name = nameMatch[1];
      return 'Nice to meet you, ' + name + '! 😊 To connect you with the right person on our team, what\'s your email address?';
    }

    // Intent matching
    if (/price|cost|pricing|how much|budget|quote|plan/.test(m))
      return 'Great question! 💰 Pricing is tailored to your specific needs. Could I get your name and company so our team can prepare an accurate quote for you?';
    if (/demo|trial|see it|how it works|show me|walkthrough/.test(m))
      return 'A demo is a great idea — you\'ll see exactly how it works in under 20 minutes! 🚀 What\'s your name and email so I can get that scheduled?';
    if (/hello|hi |hey |good morning|good afternoon|good evening/.test(m) && turn <= 1)
      return 'Hello! Great to connect with you 👋 I\'m here to help. What\'s your name, and what can I help you with today?';
    if (/urgent|asap|today|immediately|right now|rush/.test(m))
      return 'Understood — I\'ll make this a priority! 🔥 Drop your email and someone from our team will contact you immediately.';
    if (/not interested|no thanks|bye|goodbye|leave me/.test(m))
      return 'No problem at all! We\'re here whenever you need us. Have a wonderful day! 😊';
    if (/thank|thanks|perfect|great|awesome|appreciate/.test(m))
      return 'You\'re very welcome! 😊 Is there anything else I can help you with?';
    if (/problem|issue|challenge|struggling|pain|difficult/.test(m))
      return 'I hear you — that sounds frustrating. Our solution was built specifically for that. The best next step is a quick call with our team. What\'s your email?';
    if (/who are you|what are you|are you a bot|are you human|ai/.test(m))
      return 'I\'m Nova, an AI sales assistant! 🤖 I\'m here to answer questions and connect you with our team. What can I help you with?';
    if (/email|contact|reach|phone|call/.test(m))
      return 'Of course! You can share your email here and our team will reach out. Or if you prefer, drop your number and they\'ll call you directly.';

    // Stage-based fallbacks
    if (turn <= 2)
      return 'Thanks for that! To point you in the right direction, mind sharing your name and what company you\'re with?';
    if (turn <= 5)
      return 'That\'s really helpful context! 🙌 The best next step would be a quick conversation with our team. What email can they reach you at?';
    return 'I appreciate your time! Our team specialises in exactly this. Drop your email and they\'ll follow up with a tailored solution within 24 hours.';
  }

  // Show badge after 4s to attract attention
  setTimeout(function() {
    if (!isOpen) {
      var b = document.getElementById('nai-badge');
      if (b) { b.style.display = 'flex'; }
    }
  }, 4000);

})();
