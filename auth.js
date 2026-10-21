import { firebaseConfig, authorizationEndpoint } from "./auth-config.js";
const status = document.getElementById("auth-status");
const login = document.getElementById("auth-login");
const logout = document.getElementById("auth-logout");
const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
const setStatus = message => { status.textContent = message; };
if (!configured) {
  setStatus("Configuração Firebase incompleta. Procure o instrutor.");
} else {
  try {
    const [{ initializeApp }, { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js")
    ]);
    const auth = getAuth(initializeApp(firebaseConfig));
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    login.disabled = false;
    const verify = async user => {
      if (!user) { setStatus("Entre com sua conta Google para solicitar acesso."); logout.hidden = true; return; }
      logout.hidden = false;
      if (!authorizationEndpoint) { setStatus("✓ Login Google realizado com sucesso. A verificação da matrícula no Classroom ainda não está configurada; o acesso restrito não foi liberado."); return; }
      setStatus("Verificando sua matrícula na turma...");
      try {
        const token = await user.getIdToken();
        const response = await fetch(authorizationEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
          body: JSON.stringify({ requestedClass: "2025.07.186" }),
          cache: "no-store"
        });
        if (!response.ok) throw new Error("Não foi possível validar sua matrícula.");
        const result = await response.json();
        if (result.authorized !== true) { setStatus("Esta conta não está autorizada para a turma 2025.07.186."); return; }
        setStatus("Conta verificada. Bem-vindo(a) à UC11! A autorização foi confirmada.");
      } catch { setStatus("Não foi possível confirmar sua matrícula. Tente novamente ou procure o instrutor."); }
    };
    onAuthStateChanged(auth, verify, () => setStatus("Falha ao verificar a sessão."));
    login.addEventListener("click", async () => {
      login.disabled = true;
      try { await signInWithPopup(auth, provider); }
      catch (error) { setStatus(error.code === "auth/popup-closed-by-user" ? "Entrada cancelada." : "Não foi possível entrar com Google."); }
      finally { login.disabled = false; }
    });
    logout.addEventListener("click", () => signOut(auth));
  } catch { setStatus("Não foi possível carregar o serviço de login. Tente novamente mais tarde."); }
}
