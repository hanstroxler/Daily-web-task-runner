// PRODUCTION VERSION — CONTACT STATUS INDICATOR
// Shows Online from 7:30am to 4:30pm (Brisbane Time)
// Author: Hans Troxler — Finalized June 12, 2025

let timeoutId = null;

function formatBrisbaneTime(date, withSeconds = true) {
  return date.toLocaleTimeString('en-AU', {
    timeZone: 'Australia/Brisbane',
    hour: '2-digit',
    minute: '2-digit',
    second: withSeconds ? '2-digit' : undefined,
    hour12: false
  });
}

function formatBrisbaneDateTime(date) {
  return date.toLocaleString('en-AU', {
    timeZone: 'Australia/Brisbane',
    hour12: false
  });
}

function getBrisbaneComponents() {
  const formatter = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Brisbane',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });

  const now = new Date();
  const parts = formatter.formatToParts(now);
  const obj = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return { hour: parseInt(obj.hour), minute: parseInt(obj.minute) };
}

function getNextTransition(type) {
  const now = new Date();
  const brisbaneNow = new Date(now.toLocaleString('en-US', { timeZone: 'Australia/Brisbane' }));

  const target = new Date(brisbaneNow);
  if (type === 'online') {
    target.setHours(7, 30, 0, 0);
    if (brisbaneNow >= target) {
      target.setDate(target.getDate() + 1);
    }
  } else {
    target.setHours(16, 30, 0, 0);
    if (brisbaneNow >= target) {
      target.setDate(target.getDate() + 1);
    }
  }

  const utcTime = target.getTime() - (target.getTimezoneOffset() * 60000);
  return new Date(utcTime);
}

function setStatus(isOnline) {
  const time = formatBrisbaneTime(new Date());
  const indicator = document.querySelector(".ff-cub-online-indicator");
  const container = document.querySelector(".ff-cub-image-container");
  if (!indicator || !container) return;

  if (isOnline) {
    indicator.classList.add("online");
    container.setAttribute("title", "Online");
    console.log(`[${time}] CONTACT INDICATOR STATUS: ONLINE`);
  } else {
    indicator.classList.remove("online");
    container.setAttribute("title", "Offline");
    console.log(`[${time}] CONTACT INDICATOR STATUS: OFFLINE`);
  }
}

function scheduleTransition(type) {
  const now = new Date();
  const next = getNextTransition(type);
  const delay = next.getTime() - now.getTime();

  const nowStr = formatBrisbaneTime(now);
  const nextStr = formatBrisbaneDateTime(next);
  console.log(`[${nowStr}] Scheduled "${type}" at: ${nextStr}`);

  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    setStatus(type === "online");
    scheduleTransition(type === "online" ? "offline" : "online");
  }, delay);
}

function initScheduler() {
  const { hour, minute } = getBrisbaneComponents();
  const totalMins = hour * 60 + minute;
  const start = 7 * 60 + 30;
  const end = 16 * 60 + 30;

  if (totalMins >= start && totalMins < end) {
    setStatus(true);
    scheduleTransition("offline");
  } else {
    setStatus(false);
    scheduleTransition("online");
  }
}

initScheduler();
