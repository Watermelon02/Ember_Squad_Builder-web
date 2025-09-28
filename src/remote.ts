export async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function getDeviceFingerprint() {
    const deviceMemory = (navigator as any).deviceMemory || 0;
    const hardwareConcurrency = navigator.hardwareConcurrency || 0;

    const info = [
        navigator.userAgent,
        navigator.language,
        screen.width + "x" + screen.height,
        screen.colorDepth,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        hardwareConcurrency,
        deviceMemory,
        !!window.WebGLRenderingContext
    ].join("###");

    const fingerprint = sha256(info);
    return fingerprint;
}

async function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId");

  if (deviceId === null) {
    deviceId = await getDeviceFingerprint();
    localStorage.setItem("deviceId", deviceId);
    console.log("生成新的 deviceId:", deviceId);
  } else {
    console.log("读取已有的 deviceId:", deviceId);
  }

  return deviceId;
}