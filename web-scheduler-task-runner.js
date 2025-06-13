// ONLINE/OFFLINE STATUS INDICATOR SCRIPT : HANS TROXLER : [June 12, 2025] 
// Show ONLINE status if it's 7:30 AM - 4:29 PM AU/Brisbane time.
// Show OFFLINE status if it's 4:30 PM - 7:29 AM (next day).

let timeoutId = null;

// Get current Brisbane time as a Date object
function getBrisbaneTime() {
  const now = new Date();
  return new Date(now.toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' }));
}

// Calculate the next transition point: 7:30 AM or 4:30 PM
function getNextTransitionTime(currentTime) {
  const next = new Date(currentTime);
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();

  if (hour < 7 || (hour === 7 && minute < 30)) {
    // Before business hours → transition is today at 7:30 AM
    next.setHours(7, 30, 0, 0);
  } else if (hour < 16 || (hour === 16 && minute < 30)) {
    // During business hours → transition is today at 4:30 PM
    next.setHours(16, 30, 0, 0);
  } else {
    // After 4:30 PM → transition is tomorrow at 7:30 AM
    next.setDate(next.getDate() + 1);
    next.setHours(7, 30, 0, 0);
  }

  return next;
}

// Utility to convert milliseconds to readable time
function convertMilliseconds(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

// Update the status immediately when script starts
function updateOnlineStatusNow() {
  const now = getBrisbaneTime();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const indicator = document.querySelector(".ff-cub-online-indicator");
  const container = document.querySelector(".ff-cub-image-container");

  if (!indicator || !container) return;

  const isBusinessTime =
    (hour > 7 || (hour === 7 && minute >= 30)) &&
    (hour < 16 || (hour === 16 && minute < 30));

  if (isBusinessTime) {
    indicator.classList.add("online");
    container.setAttribute("title", "Online");
    console.log(`[${now.toLocaleTimeString()}] Initial check: Business hours. Online status set.`);
  } else {
    indicator.classList.remove("online");
    container.setAttribute("title", "Offline");
    console.log(`[${now.toLocaleTimeString()}] Initial check: Outside business hours. Offline status set.`);
  }
}

// Schedule the next transition (7:30 AM or 4:30 PM)
function scheduleNextCheck() {
  const now = getBrisbaneTime();
  const nextTransition = getNextTransitionTime(now);
  const delay = nextTransition.getTime() - now.getTime();

  const { hours, minutes, seconds } = convertMilliseconds(delay);
  console.log(`[${now.toLocaleTimeString()}] Next check scheduled for ${nextTransition.toLocaleTimeString()} [in ${hours}h ${minutes}m ${seconds}s]`);

  timeoutId = setTimeout(() => {
    const current = getBrisbaneTime();
    const hour = current.getHours();
    const minute = current.getMinutes();

    const indicator = document.querySelector(".ff-cub-online-indicator");
    const container = document.querySelector(".ff-cub-image-container");

    if (!indicator || !container) return;

    if (hour === 7 && minute === 30) {
      indicator.classList.add("online");
      container.setAttribute("title", "Online");
      console.log(`[${current.toLocaleTimeString()}] Business hours have started. Online status set.`);
    } else if (hour === 16 && minute === 30) {
      indicator.classList.remove("online");
      container.setAttribute("title", "Offline");
      console.log(`[${current.toLocaleTimeString()}] Business hours have ended. Offline status set.`);
    }

    // Schedule the next change
    scheduleNextCheck();
  }, delay);
}

// Kick off the process
updateOnlineStatusNow();
scheduleNextCheck();