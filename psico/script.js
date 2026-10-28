const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");

if (menuToggle && navLinks) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    navLinks.classList.toggle("is-open", !isExpanded);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.matchMedia("(min-width: 681px)").addEventListener("change", closeMenu);
}

const sectionNavigation = document.querySelectorAll('.nav-links a[href^="#"]');
const navigatedSections = Array.from(sectionNavigation)
  .map((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    return section instanceof HTMLElement ? { link, section } : null;
  })
  .filter((item) => item !== null);

if ("IntersectionObserver" in window && navigatedSections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries.filter((entry) => entry.isIntersecting);
      if (visibleSections.length === 0) return;

      const currentSection = visibleSections.reduce((closest, entry) =>
        Math.abs(entry.boundingClientRect.top - window.innerHeight * 0.25) <
        Math.abs(closest.boundingClientRect.top - window.innerHeight * 0.25)
          ? entry
          : closest
      );

      for (const { link, section } of navigatedSections) {
        const isCurrent = section === currentSection.target;
        if (isCurrent) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );

  for (const { section } of navigatedSections) {
    sectionObserver.observe(section);
  }
}

const year = document.querySelector("#current-year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

if (contactForm instanceof HTMLFormElement && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("nombre") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const modality = String(formData.get("modalidad") ?? "").trim();
    const message = String(formData.get("mensaje") ?? "").trim();
    const subject = encodeURIComponent(`Consulta desde el sitio web: ${name}`);
    const body = encodeURIComponent(
      `Hola Verónica,\n\n${message ? `${message}\n\n` : ""}Modalidad de interés: ${modality || "Sin especificar"}\n\nMi email: ${email}`
    );

    window.location.href = `mailto:laura.mendez@psicologia.com.ar?subject=${subject}&body=${body}`;
    formStatus.replaceChildren(
      document.createTextNode("Se preparó un mensaje en tu aplicación de correo. Si no se abrió, escribime a "),
      Object.assign(document.createElement("a"), {
        href: "mailto:laura.mendez@psicologia.com.ar",
        textContent: "laura.mendez@psicologia.com.ar"
      }),
      document.createTextNode(".")
    );
  });
}
