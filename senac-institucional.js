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
    const nav = existing
      ? existing.querySelector(":scope > nav") || document.createElement("nav")
      : document.createElement("nav");
    nav.classList.add("senac-nav");
    if (!nav.hasAttribute("aria-label")) nav.setAttribute("aria-label", "Navegação principal");

    if (existing) {
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

    if (existing) existing.replaceWith(header);
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

  function init() {
    if (document.querySelector(".senac-institutional-bar")) return;
    const prefix = rootPrefix();
    createHeader(prefix);
    createFooter(prefix);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
