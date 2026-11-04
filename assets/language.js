(() => {
  const sections = [...document.querySelectorAll("[data-language-section]")];
  if (!sections.length) return;

  function showLanguage(language) {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    const isPrivacyPage = Boolean(document.querySelector(".policy"));
    const isIOSPrivacyPage = Boolean(document.querySelector('[data-policy-platform="ios"]'));
    const isReleasePage = Boolean(document.querySelector(".changelog"));
    document.title = language === "zh"
      ? (isIOSPrivacyPage ? "iOS 应用隐私政策 · 语栖 EchoWords" : isPrivacyPage ? "Chrome 扩展隐私政策 · 语栖 EchoWords" : "语栖 EchoWords — 留住遇见的词")
      : (isIOSPrivacyPage ? "iOS App Privacy Policy · EchoWords" : isPrivacyPage ? "Chrome Extension Privacy Policy · EchoWords" : "EchoWords — Keep the words you meet");
    if (isReleasePage) document.title = language === "zh" ? "更新日志 · 语栖 EchoWords" : "Release notes · EchoWords";
    for (const brand of document.querySelectorAll("[data-brand-name]")) {
      brand.textContent = language === "zh" ? "语栖" : "EchoWords";
    }
    for (const brand of document.querySelectorAll("[data-brand-home]")) {
      brand.setAttribute("aria-label", language === "zh" ? "语栖主页" : "EchoWords home");
    }
    for (const footer of document.querySelectorAll("[data-brand-footer]")) {
      footer.textContent = language === "zh" ? "© 语栖" : "© EchoWords";
    }
    for (const section of sections) section.hidden = section.dataset.languageSection !== language;
    for (const link of document.querySelectorAll("[data-language-link]")) {
      if (isReleasePage) link.setAttribute("href", `?lang=${link.dataset.languageLink}${location.hash}`);
      if (link.dataset.languageLink === language) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
    for (const link of document.querySelectorAll("[data-nav-zh]")) link.hidden = language !== "zh";
    for (const link of document.querySelectorAll("[data-nav-en]")) link.hidden = language !== "en";
    for (const link of document.querySelectorAll("[data-brand-home]")) {
      const url = new URL(link.getAttribute("href"), location.href);
      url.searchParams.set("lang", language);
      link.setAttribute("href", url.href);
    }
  }

  function languageFromLocation() {
    const requested = new URLSearchParams(location.search).get("lang");
    if (requested === "zh" || requested === "en") return requested;
    return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  showLanguage(languageFromLocation());
  if (document.querySelector(".changelog")) {
    window.addEventListener("hashchange", () => {
      for (const link of document.querySelectorAll("[data-language-link]")) {
        link.setAttribute("href", `?lang=${link.dataset.languageLink}${location.hash}`);
      }
    });
  }
  // Shared version anchors remain valid after language-specific content is hidden.
  if (document.querySelector(".changelog") && location.hash) {
    requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
  }
})();
