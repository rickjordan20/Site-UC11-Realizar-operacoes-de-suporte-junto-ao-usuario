import { firebaseConfig, authorizationEndpoint } from "./auth-config.js";
// Pré-ativação: o conteúdo continua público enquanto não há backend de autorização.
// Depois da ativação, esta verificação melhora a navegação, mas NÃO protege
// os arquivos estáticos de acessos diretos pelo GitHub Pages.
if (authorizationEndpoint) {
  document.documentElement.style.visibility = "hidden";
  const loginUrl = new URL("login.html", location.href);
  const goLogin = () => location.replace(loginUrl.href);
  try {
    const [{initializeApp},{getAuth,onAuthStateChanged}] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js")
    ]);
    const auth = getAuth(initializeApp(firebaseConfig));
    onAuthStateChanged(auth, async user => {
      if (!user) return goLogin();
      try {
        const response = await fetch(authorizationEndpoint,{
          method:"POST",
          headers:{"Authorization":"Bearer "+await user.getIdToken(),"Content-Type":"application/json"},
          body:JSON.stringify({requestedClass:"2025.07.186"}),
          cache:"no-store"
        });
        if (!response.ok || (await response.json()).authorized !== true) return goLogin();
        document.documentElement.style.visibility = "";
      } catch { goLogin(); }
    },goLogin);
  } catch { goLogin(); }
}
