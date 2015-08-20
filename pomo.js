var workTime = 1500; 	//  25 min default (in seconds)
var breakTime = 300;	// default 5 min (in seconds)
var activeTimer = workTime; // initial timer to run
var running = false, onBreak = false;
var ticker;

var alarm = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/326176/Ship_Bell-Mike_Koenig-1911209136.mp3');

$(document).ready(function() {

  $('#busytime').html(displayTimer(workTime));
  $('#breaktime').html(displayTimer(breakTime));

  /* control events */
  $('#start').click(function()
  {
    if (!running) {
      /* Disable - and + buttons */
      $('.set-time').prop('disabled', true);
      $('#togglebutton').html('&nbsp;&nbsp;Pause&nbsp;&nbsp;');
      /* start timer and change state */
      ticker = setInterval(tick, 1000);
      running = !running;
    } else {
      $('.set-time').prop('disabled', false);
      $('#togglebutton').html('Continue');
      clearInterval(ticker);
      running = !running;
    }
    $(this).blur();	//remove focus from button.
  });

  /* Change work time */
  $('#increase-work').click(function() {
    workTime += 60;

    if (!onBreak) {
      activeTimer += 60;
      $('#busytime').html(displayTimer(activeTimer));
    } else {
      $('#busytime').html(displayTimer(workTime));
    }
  });

  $('#decrease-work').click(function() {
    if (workTime >= 60) {
      workTime -= 60;

      if (!onBreak && activeTimer >= 60) {
        activeTimer -= 60;
        $('#busytime').html(displayTimer(activeTimer));
      } else if (!onBreak && activeTimer < 60) {
          $('#busytime').html(displayTimer(activeTimer));
      } else {
        $('#busytime').html(displayTimer(workTime));
      }
    }
  });

  /* Change break time */
  $('#increase-break').click(function() {
    breakTime += 60;

    if (onBreak) {
      activeTimer += 60;
      $('#breaktime').html(displayTimer(activeTimer));
    } else {
      $('#breaktime').html(displayTimer(breakTime));
    }
  });

  $('#decrease-break').click(function() {
    if (breakTime >= 60)
      breakTime -= 60;

    if (onBreak && activeTimer >= 60) {
      activeTimer -= 60;
      $('#breaktime').html(displayTimer(activeTimer));
    }  else if (onBreak && activeTimer < 60) {
        $('#breaktime').html(displayTimer(activeTimer));
    } else {
      $('#breaktime').html(displayTimer(breakTime));
    }
  });
});

function tick() {
  /* deduct a second */
  if (activeTimer > 0) {

    if (onBreak)
      $('#breaktime').html(displayTimer(activeTimer - 1));
    else
      $('#busytime').html(displayTimer(activeTimer - 1));

    activeTimer--;
  }
  /* When timer = 0, alarm is played */
  if (activeTimer === 0) {
    alarm.volume = 1;
    alarm.play();
    clearInterval(ticker);

    if (onBreak) {
      activeTimer = workTime;
      onBreak = false;
      $('#busytime').html(displayTimer(workTime));
      $('#breaktime').html(displayTimer(breakTime));
    } else {
      activeTimer = breakTime;
      onBreak = true;
      $('#breaktime').html(displayTimer(breakTime));
    }
    /* Restart the timer in the next part of the sequence */
    ticker = setInterval(tick, 1000);
  }
}

function displayTimer(time) {
  var minutes = Math.floor(time / 60);
  var seconds = time % 60;
  /* Zero-padding for minutes and seconds */
  if (minutes < 10)
    minutes = "0" + minutes;
  if (seconds < 10)
    seconds = "0" + seconds;

  return minutes + ":" + seconds;
}
