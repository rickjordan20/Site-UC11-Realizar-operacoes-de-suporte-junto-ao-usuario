import { firebaseConfig, authorizationEndpoint, classroomCourseId } from "./auth-config.js";

document.documentElement.style.visibility = "hidden";
const rootPrefix = /\/(?:lessons|activities)\//.test(location.pathname) ? "../" : "";
const loginUrl = new URL(rootPrefix + "login.html", location.href);
const goLogin = () => location.replace(loginUrl.href);

try {
  const [{ initializeApp }, { getAuth, onAuthStateChanged }] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js")
  ]);
  const auth = getAuth(initializeApp(firebaseConfig));
  onAuthStateChanged(auth, async user => {
    if (!user) return goLogin();
    try {
      const response = await fetch(authorizationEndpoint, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + await user.getIdToken(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ requestedClass: classroomCourseId }),
        cache: "no-store"
      });
      if (!response.ok || (await response.json()).authorized !== true) return goLogin();
      document.documentElement.style.visibility = "";
    } catch {
      goLogin();
    }
  }, goLogin);
} catch {
  goLogin();
}
