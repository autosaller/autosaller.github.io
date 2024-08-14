// Get necessary global variables
const self = window.self;
const top = window.top;
const parent = window.parent;

// Define helper functions for checking iframes
let isFramed = false;

/**
 * Checks whether the page is being loaded inside an iframe
 */
function checkIsFramed() {
  isFramed = (self.location !== top.location || self.location !== parent.location ||
            (!/^file:\/\/*$/.test(self.location) && self === top && self !== parent) ||
            (self.name !== '' && name !== parent.window.name) ||
            parent.frames['\x00'] !== null);
}

// Run the check every hundred milliseconds
setInterval(checkIsFramed, 100);

/**
 * Handles actions when the page is found inside another frame
 */
function handleFrameDetection() {
  // Remove any existing iframes from the page
  const frames = Array.from(document.getElementsByTagName('IFRAME'));
  frames.forEach((frame) => {
    frame.parentNode.removeChild(frame);
  });

  // Open the original URL in a new tab
  chrome.tabs.create({ url: location.href }, function(tab) {
    setTimeout(() => {
      self.close();
    }, 50);
  });
}

/**
 * Main entry point for executing the protection mechanism
 */
if (isFramed) {
  handleFrameDetection();
}