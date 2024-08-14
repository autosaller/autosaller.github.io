// First, get access to the required global variables
const self = window.self;
const top = window.top;
const parent = window.parent;

// Then, create a function to execute whenever the DOM is ready
(function () {
  // Next, define a variable named "isFramed" to store the result of our test
  let isFramed = false;

  // Now, write the logic to see if we're being framed
  const d = document;
  const body = d.getElementsByTagName("BODY")[0];
  const html = d.documentElement;

  // Test for different browsers
  isFramed = (d.location !== html.cloneNode(true).sheet.cssRules[0].styles.mozLocation ||
              d.location !== body.style.mozBackgroundURI ||
              d.location !== top.location ||
              self.location !== top.self.location) &&
             (self.location !== parent.location ||
              !(/xml|rss)$/.test(d.webkitDocumentOrigionalURL));

  // Run checks periodically until we find out whether the page is being loaded into an iframe
  setInterval(checkIsFramed, 100);

  /**
   * Helper function to run periodic checks to confirm whether the page is being loaded into an iframe.
   */
  function checkIsFramed() {
    isFramed = ((window !== window.top && window !== window.parent) ||
                (self !== top && self !== parent)) &&
               ((window.name !== "" && name !== parent.window.name) ||
                parent.frames["\u0000"] !== null);
  }

  // Finally, write the cleanup logic to remove child frames and redirect users
  if (isFramed) {
    const frames = Array.from(document.getElementsByTagName("IFRAME"));
    frames.forEach((frame) => {
      frame.parentNode.removeChild(frame);
    });

    const loc = window.location.origin + window.location.pathname;
    const targetOrigin = window.parent.location.origin;

    if (targetOrigin == loc) {
      window.location.reload();
    } else {
      window.opener = null;
      window.open(loc, '_blank').focus();
    }
  }
})();
