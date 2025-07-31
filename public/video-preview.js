(async function () {
  const params = new URLSearchParams(window.location.search);
  const vastUrl = params.get("vast");

  const log = (msg) => {
    document.getElementById("log").textContent += "\n" + msg;
  };

  if (!vastUrl) {
    log("Missing ?vast= parameter in URL");
    return;
  }

  try {
    const res = await fetch(vastUrl);
    const xml = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const mediaFile = xmlDoc.querySelector("MediaFile");

    if (mediaFile && mediaFile.textContent) {
      const videoUrl = mediaFile.textContent.trim();
      const videoEl = document.getElementById("vast-video");
      videoEl.src = videoUrl;
      log("Video loaded: " + videoUrl);
    } else {
      log("No <MediaFile> found in VAST");
    }
  } catch (e) {
    log("Error fetching or parsing VAST: " + e.message);
  }
})();
