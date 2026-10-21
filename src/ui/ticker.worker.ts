// Sends a heartbeat to the page at a steady rate. Browsers slow down timers in background tabs
// (to once a minute after a while); timers inside a worker are throttled far less, so the game
// keeps ticking while the tab is hidden. The game itself always uses real elapsed time, so even
// a slowed heartbeat never loses progress.

const INTERVAL_MS = 100;
setInterval(() => postMessage(null), INTERVAL_MS);
