var workTime = 1500; 	//  25 min default (in seconds)
var breakTime = 300;	// default 5 min (in seconds)
var activeTimer = workTime; // initial timer to run
var running = false, onBreak = false;
var ticker;

var audio = new Audio('Ship_Bell-Mike_Koenig-1911209136.mp3');

$(document).ready(function() {

  $('#busytime').html(displayTimer(workTime));
  $('#breaktime').html(displayTimer(breakTime));

  /* control events */
  $('#start').click(function()
  {
    if (!running) {
      /* Disable all buttons except stop, avoid tinkering while enabled*/
      $('.set-time').prop('disabled', true);
      $('#reset').prop('disabled', true);

      /* start timer and change state */
      ticker = setInterval(tick, 1000);
      running = !running;
    }
    $(this).blur();	//remove focus from button.
  });

  $('#stop').click(function() {
    if (running) {
      /* Enable some buttons  */
      $('.set-time').prop('disabled', false);
      $('#reset').prop('disabled', false);

      clearInterval(ticker);
      running = !running;
    }
    $(this).blur();
  });

  $('#reset').click(function() {

    $('#busytime').html(displayTimer(workTime));
    activeTimer = workTime;

    $(this).blur();
  });

  /* Change work length */
  $('#m-plus').click(function() {
    workTime += 60;

    if (!onBreak) {
      activeTimer += 60;
      $('#busytime').html(displayTimer(activeTimer));
    } else {
      $('#busytime').html(displayTimer(workTime));
    }

    $(this).blur();
  });

  $('#m-min').click(function() {
    if (workTime >= 60) {
      workTime -= 60;

      if (!onBreak) {
        activeTimer -= 60;
        $('#busytime').html(displayTimer(activeTimer));
      } else {
        $('#busytime').html(displayTimer(workTime));
      }

      // $('#busytime').html(displayTimer(timer));
    }
    $(this).blur();
  });

  /* Change break length */

  $('#break-m-plus').click(function() {
    /* Add sixty seconds to breakTime */
    breakTime += 60;

    if (onBreak) {
      activeTimer += 60;
      $('#breaktime').html(displayTimer(activeTimer));
    } else {
      $('#breaktime').html(displayTimer(breakTime));
    }
    this.blur();
  });

  $('#break-m-min').click(function() {
    if (breakTime >= 60)
      breakTime -= 60;

    if (onBreak) {
      activeTimer -= 60;
      $('#breaktime').html(displayTimer(activeTimer));
    } else {
      $('#breaktime').html(displayTimer(breakTime));
    }
    this.blur();
  });
});

function tick() {
  /* Whenever there's time on the clock we deduct a second */
  if (activeTimer > 0) {

    if (onBreak)
      $('#breaktime').html(displayTimer(activeTimer - 1));
    else
      $('#busytime').html(displayTimer(activeTimer - 1));

    activeTimer--;
  }

  /* When timer = 0, alarm is played */

  if (activeTimer === 0) {
    audio.volume = 1;
    audio.play();
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
