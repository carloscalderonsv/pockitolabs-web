export default function handler(req, res) {
  const code = req.query.code;
  const fullUrl = `https://splitsmart.pockitolabs.com/invite${code ? `?code=${code}` : ''}`;
  const deepLink = code ? `splitsmart://invite?code=${code}` : null;

  if (!code) {
    const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invalid Invite – SplitSmart</title>
  <style>
    body { margin: 0; background: #0F0A1E; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 24px; box-sizing: border-box; }
    .card { max-width: 400px; }
    .logo { font-size: 48px; margin-bottom: 16px; }
    h1 { color: #FFD700; font-size: 22px; margin: 0 0 12px; }
    p { color: #9CA3AF; font-size: 15px; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🪙</div>
    <h1>Invalid Invite Link</h1>
    <p>This invite link is missing a code. Please ask the group admin to share a valid invite link.</p>
  </div>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html');
    return res.status(400).send(errorHtml);
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Join my group on SplitSmart</title>

  <!-- Open Graph -->
  <meta property="og:title" content="Join my group on SplitSmart" />
  <meta property="og:description" content="Split bills smarter with AI. No ads. No limits." />
  <meta property="og:image" content="https://splitsmart.pockitolabs.com/og-image.png" />
  <meta property="og:url" content="${fullUrl}" />
  <meta property="og:type" content="website" />

  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      background: #0F0A1E;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
      text-align: center;
    }
    .card {
      max-width: 420px;
      width: 100%;
    }
    .logo {
      font-size: 64px;
      line-height: 1;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #FFD700;
      margin: 0 0 10px;
    }
    p.subtitle {
      color: #9CA3AF;
      font-size: 15px;
      margin: 0 0 36px;
      line-height: 1.5;
    }
    .buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 14px 20px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: opacity 0.15s;
    }
    .btn:active { opacity: 0.8; }
    .btn-primary {
      background: #FFD700;
      color: #0F0A1E;
    }
    .btn-secondary {
      background: #6366F1;
      color: #fff;
    }
    .other-store {
      margin-top: 16px;
      font-size: 13px;
      color: #6B7280;
    }
    .other-store a {
      color: #9CA3AF;
      text-decoration: underline;
    }
    .hidden { display: none; }
    footer {
      margin-top: 48px;
      font-size: 12px;
      color: #4B5563;
    }
  </style>
</head>
<body>
  <div class="card" id="landing" class="hidden">
    <div class="logo">🪙</div>
    <h1>You've been invited to a group on SplitSmart</h1>
    <p class="subtitle">Split bills smarter with AI. No ads. No limits.</p>

    <div class="buttons">
      <a class="btn btn-primary" id="open-app-btn" href="${deepLink}">Open in App</a>
      <a class="btn btn-secondary" id="store-btn" href="#" target="_blank" rel="noopener noreferrer">Get SplitSmart</a>
    </div>

    <div class="other-store" id="other-store"></div>
  </div>

  <footer>Powered by Pockito Labs</footer>

  <script>
    (function () {
      var deepLink = "${deepLink}";
      var iosUrl = "https://apps.apple.com/app/id6760598028";
      var androidUrl = "https://play.google.com/store/apps/details?id=com.carloscalderonsv.SplitSmart";

      var ua = navigator.userAgent || "";
      var isIOS = /iPhone|iPad|iPod/i.test(ua);
      var isAndroid = /Android/i.test(ua);

      var storeBtn = document.getElementById("store-btn");
      var otherStore = document.getElementById("other-store");

      if (isIOS) {
        storeBtn.href = iosUrl;
        storeBtn.textContent = "Get on the App Store";
        otherStore.innerHTML = 'Also available on <a href="' + androidUrl + '" target="_blank" rel="noopener noreferrer">Google Play</a>';
      } else if (isAndroid) {
        storeBtn.href = androidUrl;
        storeBtn.textContent = "Get on Google Play";
        otherStore.innerHTML = 'Also available on <a href="' + iosUrl + '" target="_blank" rel="noopener noreferrer">the App Store</a>';
      } else {
        storeBtn.href = iosUrl;
        storeBtn.textContent = "Get SplitSmart";
        otherStore.innerHTML = 'Available on <a href="' + iosUrl + '" target="_blank" rel="noopener noreferrer">App Store</a> &amp; <a href="' + androidUrl + '" target="_blank" rel="noopener noreferrer">Google Play</a>';
      }

      // Try to open the deep link immediately
      window.location.href = deepLink;

      // After 2 seconds, show the fallback landing page
      setTimeout(function () {
        document.getElementById("landing").style.display = "block";
      }, 2000);

      // "Open in App" button retries the deep link
      document.getElementById("open-app-btn").addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = deepLink;
      });
    })();
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
