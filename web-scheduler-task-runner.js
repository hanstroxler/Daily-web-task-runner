// ONLINE/OFFLINE STATUS INDICATOR SCRIPT : HANS TROXLER : [June 12, 2025] 
// Show ONLINE status if it's 7:30 - 4:29 AU/Brisbane time.
// Show OFFLINE status if it's 4:30pm - 7:29am (the next day).
let timeoutId = null;
function getBrisbaneTime() {
  const now = new Date();
  return new Date(now.toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' }));
}

function getNextTransitionTime(currentTime) {
  const next = new Date(currentTime);
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();

  if (hour < 7 || (hour === 7 && minute < 30)) {
    // Before business hours → set to 7:30 AM today
    next.setHours(7, 30, 0, 0);
  } else if (hour < 16 || (hour === 16 && minute < 30)) {    
    // During business hours → set to 4:30 PM today
    next.setHours(16, 30, 0, 0);
  } else {
    // After 4:30 PM → set to 7:30 AM tomorrow
    next.setDate(next.getDate() + 1);
    next.setHours(7, 30, 0, 0);
  }

  return next;
}

// time delay logging
function convertMilliseconds(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

function scheduleNextCheck() {
  const now = getBrisbaneTime();
  const nextTransition = getNextTransitionTime(now);
  const delay = nextTransition.getTime() - now.getTime();

  // track the next scheduled check
  const { hours, minutes, seconds } = convertMilliseconds(delay);
  
  const formattedNext = nextTransition.toLocaleTimeString();
  console.log(`[${now.toLocaleTimeString()}] CONTACT BOX: Next check scheduled for ${formattedNext} [${hours} hours, ${minutes} minutes, ${seconds} seconds]`);

  timeoutId = setTimeout(() => {
    const current = getBrisbaneTime();
    const hour = current.getHours();
    const minute = current.getMinutes();

    if (hour === 7 && minute === 30) {
      console.log(`[${current.toLocaleTimeString()}] Business hours have started.`);
    } else if (hour === 16 && minute === 30) {
      console.log(`[${current.toLocaleTimeString()}] Business hours have ended.`);
    }

    // Schedule next transition after this one
    scheduleNextCheck();
  }, delay);
}

// Start the scheduling
scheduleNextCheck();
