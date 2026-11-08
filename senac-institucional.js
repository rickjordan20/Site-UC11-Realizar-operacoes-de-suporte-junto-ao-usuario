(() => {
  "use strict";

  function rootPrefix() {
    return /\/(?:lessons|activities)\//.test(location.pathname) ? "../" : "";
  }

  function createLink(href, text) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = text;
    return link;
  }

  function createHeader(prefix) {
    const existing = document.querySelector("body > header");
    // A página inicial possui navegação interativa própria; não a remova nem mova seus nós.
    const preserveSiteNavigation = Boolean(existing?.classList.contains("site-header"));
    const header = document.createElement("header");
    header.className = "senac-institutional-bar";

    const brand = document.createElement("a");
    brand.className = "senac-institutional-brand";
    brand.href = prefix + "index.html";
    brand.setAttribute("aria-label", "Página inicial da UC11");

    const logo = document.createElement("span");
    logo.className = "senac-institutional-logo";
    const image = document.createElement("img");
    image.src = "https://www.correiobraziliense.com.br/_midias/jpg/2024/04/19/senaclogo-36333282.jpg";
    image.alt = "Senac";
    image.loading = "eager";
    image.referrerPolicy = "no-referrer";
    logo.append(image);

    const divider = document.createElement("span");
    divider.className = "senac-brand-divider";
    divider.setAttribute("aria-hidden", "true");

    const identity = document.createElement("span");
    identity.className = "senac-institutional-identity";
    const institution = document.createElement("strong");
    institution.textContent = "Senac Distrito Federal";
    const course = document.createElement("small");
    course.textContent = "Técnico em Desenvolvimento de Sistemas";
    const courseLine = document.createElement("span");
    courseLine.className = "senac-course-line";
    const unit = document.createElement("span");
    unit.className = "senac-institutional-course";
    unit.textContent = "UC11 – Suporte ao Usuário";
    courseLine.append(unit);
    identity.append(institution, course, courseLine);
    brand.append(logo, divider, identity);

    const group = document.createElement("div");
    group.className = "senac-nav-group";
    const nav = existing && !preserveSiteNavigation
      ? existing.querySelector(":scope > nav") || document.createElement("nav")
      : document.createElement("nav");
    nav.classList.add("senac-nav");
    if (!nav.hasAttribute("aria-label")) nav.setAttribute("aria-label", "Navegação principal");

    if (existing && !preserveSiteNavigation) {
      existing.querySelectorAll(":scope > a:not(.brand)").forEach(link => nav.append(link));
      const theme = existing.querySelector(":scope > #theme");
      if (theme) group.append(theme);
    }

    if (!nav.querySelector("a")) {
      nav.append(createLink(prefix + "index.html", "Início"));
      nav.append(createLink(prefix + "politica-de-privacidade.html", "Privacidade"));
    }
    group.append(nav);
    header.append(brand, group);

    if (existing && preserveSiteNavigation) existing.before(header);
    else if (existing) existing.replaceWith(header);
    else document.body.prepend(header);
  }

  function createFooter(prefix) {
    let footer = document.querySelector("body > footer");
    if (!footer) {
      footer = document.createElement("footer");
      document.body.append(footer);
    }
    footer.classList.add("senac-site-footer");
    footer.replaceChildren(
      document.createTextNode("UC11 · Turma 2025.07.186 · "),
      createLink(prefix + "politica-de-privacidade.html", "Política de Privacidade")
    );
  }

  function createProfileControl() {
    const root = document.createElement("div");
    root.className = "senac-profile";
    root.hidden = true;

    const trigger = document.createElement("button");
    trigger.className = "senac-profile-trigger";
    trigger.type = "button";
    trigger.textContent = "Perfil";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", "senac-profile-panel");

    const panel = document.createElement("section");
    panel.className = "senac-profile-panel";
    panel.id = "senac-profile-panel";
    panel.setAttribute("aria-label", "Perfil da conta");
    panel.hidden = true;

    const details = document.createElement("div");
    details.className = "senac-profile-details";
    const avatar = document.createElement("span");
    avatar.className = "senac-profile-avatar";
    avatar.setAttribute("aria-hidden", "true");
    const identity = document.createElement("div");
    identity.className = "senac-profile-identity";
    const name = document.createElement("strong");
    name.className = "senac-profile-name";
    const email = document.createElement("span");
    email.className = "senac-profile-email";
    const role = document.createElement("span");
    role.className = "senac-profile-role";
    role.hidden = true;
    identity.append(name, email, role);
    details.append(avatar, identity);

    const status = document.createElement("p");
    status.className = "senac-profile-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.hidden = true;

    const logout = document.createElement("button");
    logout.className = "senac-profile-logout";
    logout.type = "button";
    logout.textContent = "Sair da conta";
    panel.append(details, status, logout);
    root.append(trigger, panel);

    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
    document.addEventListener("click", event => {
      if (!root.contains(event.target)) {
        trigger.setAttribute("aria-expanded", "false");
        panel.hidden = true;
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !panel.hidden) {
        trigger.setAttribute("aria-expanded", "false");
        panel.hidden = true;
        trigger.focus();
      }
    });

    return { root, avatar, name, email, role, status, trigger, panel, logout };
  }

  async function connectProfile(profile, prefix) {
    try {
      const [{ firebaseConfig, authorizationEndpoint, classroomCourseId }, { getApps, initializeApp }, { getAuth, onAuthStateChanged, signOut }] = await Promise.all([
        import("./auth-config.js"),
        import("https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js")
      ]);
      const app = getApps()[0] || initializeApp(firebaseConfig);
      const auth = getAuth(app);

      const roleLabels = { student: "Aluno", teacher: "Professor" };
      const showRole = async user => {
        const cacheKey = "uc11-role:" + user.uid;
        let role = null;
        try { role = sessionStorage.getItem(cacheKey); } catch { /* storage unavailable */ }
        if (!roleLabels[role]) {
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
            role = response.ok ? (await response.json()).role : null;
            if (roleLabels[role]) {
              try { sessionStorage.setItem(cacheKey, role); } catch { /* storage unavailable */ }
            }
          } catch {
            role = null;
          }
        }
        profile.role.textContent = roleLabels[role] || "";
        profile.role.hidden = !roleLabels[role];
      };

      onAuthStateChanged(auth, user => {
        profile.root.hidden = !user;
        if (!user) {
          profile.role.hidden = true;
          return;
        }
        showRole(user);

        const displayName = user.displayName || "Conta Google";
        profile.name.textContent = displayName;
        profile.email.textContent = user.email || "E-mail não disponível";
        profile.avatar.replaceChildren();
        if (user.photoURL) {
          const image = document.createElement("img");
          image.src = user.photoURL;
          image.alt = "";
          image.referrerPolicy = "no-referrer";
          image.addEventListener("error", () => {
            image.remove();
            profile.avatar.textContent = displayName.charAt(0).toUpperCase();
          }, { once: true });
          profile.avatar.append(image);
        } else {
          profile.avatar.textContent = displayName.charAt(0).toUpperCase();
        }
      }, error => {
        console.error("Could not read the Firebase profile session:", error);
      });

      profile.logout.addEventListener("click", async () => {
        profile.logout.disabled = true;
        profile.logout.textContent = "Saindo...";
        profile.status.hidden = true;
        try {
          await signOut(auth);
          window.location.replace(new URL(prefix + "login.html", window.location.href).href);
        } catch (error) {
          console.error("Could not sign out of Firebase:", error);
          profile.status.textContent = "Não foi possível encerrar a sessão. Tente novamente.";
          profile.status.hidden = false;
          profile.logout.disabled = false;
          profile.logout.textContent = "Sair da conta";
        }
      });
    } catch (error) {
      console.error("Could not initialize the institutional profile:", error);
    }
  }

  function init() {
    if (document.querySelector(".senac-institutional-bar")) return;
    const prefix = rootPrefix();
    const profile = createProfileControl();
    createHeader(prefix);
    document.querySelector(".senac-institutional-bar .senac-nav-group").append(profile.root);
    connectProfile(profile, prefix);
    createFooter(prefix);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
