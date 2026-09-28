(() => {
  const $ = id => document.getElementById(id);
  // Calculator
  $('calc-run').onclick = () => {
    const v = $('calc-input').value;
    // Try natural language first, then basic math
    let result;
    if (/what is [0-9%]+ (percent of|of) [0-9]+/i.test(v)) {
      // Simple percent parsing
      const m = v.match(/([0-9]+) (percent of|of) ([0-9]+)/i);
      if (m) {
        const a = parseFloat(m[1]);
        const b = parseFloat(m[3]);
        result = a / 100 * b;
      }
    } else {
      result = /^[0-9+*/().%\s-]+$/.test(v) ? 'Result: '+Function('return ('+v+')')() : 'Use numbers and basic operators only.';
    }
    $('calc-result').textContent = result !== undefined ? result : 'Use numbers and basic operators only.';
  };
  // Natural language: type "what is 15 percent of 200" = "Result: 30"
  $('calc-input').onkeypress = e => {
    if (e.key === 'Enter') { $('calc-run').onclick(); }
  };

  // Clipboard History
  const clips=JSON.parse(localStorage.getItem('dof-demo-clips')||'[]'); const list=$('clip-list'); const draw=()=>list.innerHTML=clips.map(x=>'<li>'+x.replace(/[<>&]/g,'')+'</li>').join(''); draw();
  $('clip-save').onclick=()=>{const v=$('clip-input').value.trim();if(v){clips.unshift(v);localStorage.setItem('dof-demo-clips',JSON.stringify(clips.slice(0,8)));$('clip-input').value='';draw();}};
  $('clip-clear').onclick=()=>{localStorage.removeItem('dof-demo-clips');clips.splice(0,clips.length);draw();};
  $('clip-input').onkeypress = e => {
    if (e.key === 'Enter') { $('clip-save').onclick(); }
  };

  // Media Player
  $('media-file').onchange=e=>{const f=e.target.files[0];if(f){$('media-player').src=URL.createObjectURL(f);$('media-player').play().catch(()=>{});}};
  // Volume controls
  $('volume-up').onclick = () => { $('media-player').volume = Math.min($('media-player').volume + 0.1, 1); };
  $('volume-down').onclick = () => { $('media-player').volume = Math.max($('media-player').volume - 0.1, 0); };
  // Speed controls
  $('speed-1x').onclick = () => {
    const speeds = [0.5, 1, 1.5, 2];
    const idx = speeds.findIndex(s => s === 1) || 0;
    $('media-player'.playbackRate = speeds[(idx + 1) % speeds.length];
    $('speed-1x').textContent = $('media-player'.playbackRate === 0.5 ? '0.5x' : $('media-player'.playbackRate === 1.5 ? '1.5x' : '2x');
  };

  // Recorder
  let recorder,chunks=[]; $('record-start').onclick=async()=>{try{const s=await navigator.mediaDevices.getUserMedia({audio:true});recorder=new MediaRecorder(s);chunks=[];recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=()=>{$('recording').src=URL.createObjectURL(new Blob(chunks,{type:recorder.mimeType}));s.getTracks().forEach(t=>t.stop());};recorder.start();$('record-status').textContent='Recording…';$('record-start').disabled=$('record-stop').disabled=false;}catch{$('record-status').textContent='Microphone permission was not granted.';}}; $('record-stop').onclick=()=>{recorder.stop();$('record-status').textContent='Recording ready to play.';$('record-start').disabled=false;$('record-stop').disabled=true;};
  $('record-start').onkeypress = $('record-stop).onkeypress = e => { if (e.key === 'Enter') { e.target.onclick(); } };

  // Studio (Image editing)
  $('image-file').onchange=e=>{const f=e.target.files[0];if(f){const i=$('image-preview');i.src=URL.createObjectURL(f);i.hidden=false;}}; $('brightness').oninput=e=>$('image-preview').style.filter='brightness('+e.target.value+'%)'; $('contrast').oninput=e=>$('image-preview').style.filter='brightness('+brightness.value+'%) contrast('+e.target.value+'%)';

  // Nova Voice Assistant
  $('nova-run').onclick=()=>{const q=$('nova-input').value.toLowerCase();let r;
    if (q.includes('hello') || q.includes('hi')) r='Hello! How can I help you today?';
    else if (q.includes('time')) r='It is '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    else if (q.includes('help')) r='I can help with: telling the time, greeting you, or responding to simple commands. Try asking "what time is it" or saying "hello"';
    else if (q.includes('stop') || q.includes('cancel')) r='Okay, I\'ll stop listening.';
    else r='This web demo supports hello, help, and time.';
  $('nova-result').textContent=r;
  if('speechSynthesis'in window)speechSynthesis.speak(new SpeechSynthesisUtterance(r));
  };
  $('nova-input').onkeypress = e => {
    if (e.key === 'Enter') { $('nova-run').onclick(); }
  };
})();