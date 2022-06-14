const sw = {
    // PROPERTIES
    etime : null, // html time display
    erst : null, // html reset button
    ego : null, // html start/stop button
    timer : null, // timer object
    now : 0, // current elapsed time
  
    // INITIALIZE
    init : () => {
      // GET HTML ELEMENTS
      sw.etime = document.getElementById("sw-time");
      sw.erst = document.getElementById("sw-rst");
      sw.ego = document.getElementById("sw-go");
  
      // ENABLE BUTTON CONTROLS
      sw.erst.onclick = sw.reset;
      sw.ego.onclick = sw.start;
      sw.erst.disabled = false;
      sw.ego.disabled = false;
    },
  
    // START
    start : () => {
      sw.timer = setInterval(sw.tick, 1000);
      sw.ego.value = "Stop";
      sw.ego.onclick = sw.stop;

      // start twitch poll
      pollActive = true

      // animate twitch piechart with pulse
      document.getElementsByClassName("twitch-piechart-container")[0].classList.add("pulse-animation")

    },
  
    // STOP
    stop : () => {
      clearInterval(sw.timer);
      sw.timer = null;
      sw.ego.value = "Start";
      sw.ego.onclick = sw.start;

      // stop twitch poll
      pollActive = false

      // disable twitch-piechart pulse animation
      document.getElementsByClassName("twitch-piechart-container")[0].classList.remove("pulse-animation")
    },
  
    // TIMER ACTION
    tick : () => {
      // CALCULATE MINS, SECONDS
      sw.now++;
      let mins = 0, secs = 0,
      remain = sw.now;
      mins = Math.floor(remain / 60);
      remain -= mins * 60;
      secs = remain;
  
      // UPDATE THE DISPLAY TIMER
      if (mins<10) { mins = "0" + mins; }
      if (secs<10) { secs = "0" + secs; }
      sw.etime.innerHTML = mins + ":" + secs;
    },
  
    // RESET
    reset : () => {
      if (sw.timer != null) { sw.stop(); }
      sw.now = -1;
      sw.tick();
    }
  };
  