const header = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".main-nav a");
const internalLinks = document.querySelectorAll('a[href^="#"]:not(.download-card)');

document.getElementById("year").textContent = new Date().getFullYear();


menuToggle?.addEventListener("click", () => {
  const open = mainNav?.classList.toggle("open") ?? false;
  menuToggle.setAttribute("aria-expanded", String(open));
});

const setActiveNav = targetId => {
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${targetId}`);
  });
};

const scrollToTarget = targetId => {
  if (targetId === "#home" || targetId === "#top") {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    return true;
  }

  const target = document.getElementById(targetId.slice(1));
  if (!target) return false;

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
};

internalLinks.forEach(link => {
  link.addEventListener("click", event => {
    const targetId = link.getAttribute("href");

    if (targetId && scrollToTarget(targetId)) {
      event.preventDefault();
      if (link.closest(".main-nav")) {
        setActiveNav(targetId === "#top" ? "home" : targetId.slice(1));
      }
    }

    if (link.closest(".main-nav") && mainNav) {
      mainNav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });
});


const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 20);

  if (window.scrollY <= 20) {
    setActiveNav("home");
  }
};
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();


const sections = [...document.querySelectorAll("main section[id], main [id=\"features\"]")];

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${id}`
        );
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach(section => sectionObserver.observe(section));


const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));



document.addEventListener("click", event => {
  if (mainNav && !mainNav.contains(event.target) && !menuToggle?.contains(event.target)) {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});
