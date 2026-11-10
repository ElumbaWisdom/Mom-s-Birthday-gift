/* Mom's birthday app — ONE shared script for every page.
   Link it in every page, at the end of the body, like this:
     <script src="script.js" defer></script>
   It works on landing, hub, tiles, and the finale video page.
   Every block below first checks "is this thing on this page?"
   If it is not there, that block just skips it — so the same file
   never crashes a page that does not have that button or video.
   The shell's song player is NOT in here. That lives in
   index.html only, so it does not run twice inside the frame. */

// Tell the shell (index.html) to pause / resume its song.
// The shell listens for these exact words.
function tellShell(message) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: message }, "*");
  }
}

/* ---- 1. Seal button on the landing page -> hub ---- */
// Landing has <button id="sealBtn">. Hub and tiles do not,
// so on those pages sealBtn is null and this block does nothing.
var sealBtn = document.getElementById("sealBtn");
if (sealBtn) {
  sealBtn.addEventListener("click", function () {
    window.location.href = "hub.html";
  });
}

/* ---- 2. Any button that should go somewhere ---- */
// Use it in HTML like this, no new JavaScript needed per page:
//   <button data-go="hub.html">Back to all the pages</button>
//   <button data-go="finale.html">Watch the video for you</button>
var goButtons = document.querySelectorAll("[data-go]");
goButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    window.location.href = button.getAttribute("data-go");
  });
});

/* ---- 3. Countdown to Mom's birthday, Nov 10, 2026 ---- */
// Only runs if the page has <p id="countdown"></p> (or a div with
// that id). Add that one line to landing.html where you want it
// to show, and this block will fill it in every second.
// If the page has no countdown element, this block does nothing.
var countdown = document.getElementById("countdown");
if (countdown) {
  var birthday = new Date("2026-11-10T00:00:00");

  function updateCountdown() {
    var now = new Date();
    var gap = birthday - now;

    if (gap <= 0) {
      countdown.textContent = "Happy Birthday, Mom!";
      return;
    }

    var days = Math.floor(gap / (1000 * 60 * 60 * 24));
    var hours = Math.floor((gap / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((gap / (1000 * 60)) % 60);
    var seconds = Math.floor((gap / 1000) % 60);

    countdown.textContent =
      days + " days : " + hours + " hours : " + minutes + " minutes : " + seconds + " seconds";
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ---- 4. Videos: start muted, song keeps playing ---- */
// Every <video> on the page starts muted. The viewer unmutes it
// herself with the speaker button on the video controls.
// The song is NOT paused while a video plays — it keeps playing
// in the background, muted or unmuted. The only way the song
// stops is the Pause song button in the shell.
var videos = document.querySelectorAll("video");
videos.forEach(function (video) {
  video.muted = true;
});

/* ---- 5. Tell the shell which song this page gets ---- */
// Added Nov 10, 2026. The shell (index.html) holds all three
// songs, and each page tells it which one to play when it loads.
// The next page sends its own song when it loads, so going back
// to the hub or landing switches back to Thank You Lord by itself.
//   landing / hub / LOML            -> "song-overall" (Thank You Lord)
//   My Greatest Motivation,
//   My Core Support System          -> "song-where-you-are"
//                                      (I Just Want To Be Where You Are)
//   Mi Familia, My Stubborn Woman   -> "song-make-a-way"
//                                      (God Will Make A Way)
// The One Who Raised Me tile was removed, so it is not listed here.
// If a page is opened directly (not inside the shell), tellShell
// does nothing and there is no song — that is expected, the shell
// is the front door.
var pageName = window.location.pathname.split("/").pop();
var songForPage = "song-overall";
if (pageName === "my-greatest-motivation.html" ||
    pageName === "my-core-support-system.html") {
  songForPage = "song-overall";
} else if (pageName === "mi-familia.html" ||
           pageName === "my-stubborn-woman.html") {
  songForPage = "song-overall";
}
tellShell(songForPage);

// If she leaves the page while a video is still playing,
// tell the shell to resume the song in the next page.
window.addEventListener("pagehide", function () {
  tellShell("video-pause");
});
