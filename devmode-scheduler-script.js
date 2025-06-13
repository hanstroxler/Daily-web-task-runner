// DEV MODE : ONLINE/OFFLINE TEST SCRIPT : HANS TROXLER : [June 12, 2025]
// Online starts immediately → lasts 10 sec → 5 sec delay → repeat 5 times

let devCycleCount = 0;
const maxCycles = 5;

function devLog(message) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] DEV MODE: ${message}`);
}

function setStatus(isOnline) {
  const indicator = document.querySelector(".ff-cub-online-indicator");
  const container = document.querySelector(".ff-cub-image-container");
  if (!indicator || !container) return;

  if (isOnline) {
    indicator.classList.add("online");
    container.setAttribute("title", "Online");
    devLog("Status set to ONLINE.");
  } else {
    indicator.classList.remove("online");
    container.setAttribute("title", "Offline");
    devLog("Status set to OFFLINE.");
  }
}

function startDevCycle() {
  if (devCycleCount >= maxCycles) {
    devLog("Completed all 5 test cycles. Dev mode ending.");
    return;
  }

  devCycleCount++;
  devLog(`🔁 Starting cycle ${devCycleCount} of ${maxCycles}`);

  // ONLINE immediately
  setStatus(true);

  // After 10 seconds → OFFLINE
  setTimeout(() => {
    setStatus(false);

    // Wait 5 more seconds → start next cycle
    setTimeout(() => {
      startDevCycle();
    }, 5000); // 5 sec delay before next cycle

  }, 10000); // 10 sec online duration
}

// Run the dev test loop
startDevCycle();