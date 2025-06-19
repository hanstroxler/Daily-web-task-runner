document.addEventListener('DOMContentLoaded', function() {
  // PRODUCTION VERSION — CONTACT STATUS INDICATOR
  // Shows Online from 7:30am to 4:30pm (Brisbane Time)
  // Author: Hans Troxler — Finalized and Fixed June 12, 2025
  
  let timeoutId = null;
  
  function getBrisbaneTime(date = new Date()) {
    return new Date(date.toLocaleString("en-US", { timeZone: "Australia/Brisbane" }));
  }
  
  function formatBrisbaneTime(date, withSeconds = true) {
    return date.toLocaleTimeString("en-AU", {
      timeZone: "Australia/Brisbane",
      hour: "2-digit",
      minute: "2-digit",
      second: withSeconds ? "2-digit" : undefined,
      hour12: false
    });
  }
  
  function formatBrisbaneDateTime(date) {
    return date.toLocaleString("en-AU", {
      timeZone: "Australia/Brisbane",
      hour12: false
    });
  }
  
  function setStatus(isOnline) {
    const brisbaneNow = getBrisbaneTime();
    const indicator = document.querySelector(".ff-cub-online-indicator");
    const container = document.querySelector(".ff-cub-image-container");
  
    if (!indicator || !container) return;
  
    if (isOnline) {
      indicator.classList.add("online");
      container.setAttribute("title", "Online");
      console.log(`[${formatBrisbaneTime(brisbaneNow)}] CONTACT INDICATOR STATUS: ONLINE`);
    } else {
      indicator.classList.remove("online");
      container.setAttribute("title", "Offline");
      console.log(`[${formatBrisbaneTime(brisbaneNow)}] CONTACT INDICATOR STATUS: OFFLINE`);
    }
  }
  
  function getNextBrisbaneTime(hour, minute) {
    const now = getBrisbaneTime();
    const next = new Date(now);
    next.setHours(hour, minute, 0, 0);
  
    if (now >= next) {
      next.setDate(next.getDate() + 1);
    }
  
    return next;
  }
  
  function scheduleTransition(type) {
    clearTimeout(timeoutId);
  
    const now = getBrisbaneTime();
    let targetTime;
  
    if (type === "online") {
      targetTime = getNextBrisbaneTime(7, 30);
    } else {
      targetTime = getNextBrisbaneTime(16, 30);
    }
  
    const delay = targetTime.getTime() - now.getTime();
    console.log(`[${formatBrisbaneTime(now)}] Next scheduled "${type}" at: ${formatBrisbaneDateTime(targetTime)}`);
  
    timeoutId = setTimeout(() => {
      setStatus(type === "online");
      scheduleTransition(type === "online" ? "offline" : "online");
    }, delay);
  }
  
  function initScheduler() {
    const now = getBrisbaneTime();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const totalMins = currentHour * 60 + currentMinute;
  
    const start = 7 * 60 + 30;
    const end = 16 * 60 + 30;
  
    if (totalMins >= start && totalMins < end) {
      setStatus(true); // within business hours
      scheduleTransition("offline");
    } else {
      setStatus(false);
      scheduleTransition("online");
    }
  }
  
  initScheduler();

});