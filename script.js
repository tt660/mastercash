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

const partnersSwiperElements = [...document.querySelectorAll(".partners-swiper")];

if (partnersSwiperElements.length && !window.Swiper) {
  console.error("SwiperJS failed to load; the partner carousels were not initialized.");
}

if (partnersSwiperElements.length && window.Swiper) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let userPaused = reducedMotion.matches;
  const partnersSwipers = partnersSwiperElements.map((element, index) => {
    const wrapper = element.querySelector(".swiper-wrapper");
    const originalSlides = [...wrapper.children];
    originalSlides.forEach(slide => {
      const duplicate = slide.cloneNode(true);
      duplicate.setAttribute("aria-hidden", "true");
      duplicate.querySelectorAll("img").forEach(image => {
        image.alt = "";
      });
      wrapper.append(duplicate);
    });

    return new Swiper(element, {
      loop: true,
      grabCursor: true,
      init: !userPaused && !document.hidden,
      autoplay: {
        delay: 0,
        reverseDirection: index === 1,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      speed: 7000,
      breakpoints: {
        0: { slidesPerView: 1.2, spaceBetween: 14, speed: 4500 },
        540: { slidesPerView: 2, spaceBetween: 18, speed: 6000 },
        900: { slidesPerView: 3, spaceBetween: 24, speed: 7000 }
      }
    });
  });

  const syncAutoplay = () => {
    partnersSwipers.forEach(swiper => {
      if (!swiper.initialized) {
        if (!userPaused && !document.hidden) swiper.init();
      } else if (userPaused || document.hidden) {
        swiper.autoplay.stop();
      } else {
        swiper.autoplay.start();
      }
    });
  };

  partnersSwiperElements.forEach(element => {
    element.addEventListener("focusin", () => {
      partnersSwipers.forEach(swiper => swiper.autoplay.stop());
    });

    element.addEventListener("focusout", event => {
      if (!element.contains(event.relatedTarget)) syncAutoplay();
    });
  });

  document.addEventListener("visibilitychange", syncAutoplay);
  reducedMotion.addEventListener("change", event => {
    userPaused = event.matches;
    syncAutoplay();
  });

  syncAutoplay();
}


document.addEventListener("click", event => {
  if (mainNav && !mainNav.contains(event.target) && !menuToggle?.contains(event.target)) {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});
