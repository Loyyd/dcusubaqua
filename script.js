const committeeMembers = [
  {
    role: "Captain",
    name: "Committee Member",
    note: "Leads the club and keeps the season moving.",
    image: "assets/headshots/captain.png",
  },
  {
    role: "Secretary",
    name: "Committee Member",
    note: "Handles comms, admin, and club coordination.",
    image: "assets/headshots/secretary.png",
  },
  {
    role: "Treasurer",
    name: "Committee Member",
    note: "Manages budgets, payments, and planning.",
    image: "assets/headshots/treasurer.png",
  },
  {
    role: "Equipment Officer",
    name: "Committee Member",
    note: "Looks after club kit and gear logistics.",
    image: "assets/headshots/equipment.png",
  },
  {
    role: "Training Officer",
    name: "Committee Member",
    note: "Supports progression from pool training to qualification.",
    image: "assets/headshots/training.png",
  },
  {
    role: "Diving Officer",
    name: "Committee Member",
    note: "Oversees diving operations and trip readiness.",
    image: "assets/headshots/diving-officer.png",
  },
  {
    role: "Underwater Hockey Captain",
    name: "Committee Member",
    note: "Drives hockey sessions and team development.",
    image: "assets/headshots/hockey-captain.png",
  },
  {
    role: "Events Officer",
    name: "Committee Member",
    note: "Plans socials, nights out, and special club moments.",
    image: "assets/headshots/events.png",
  },
  {
    role: "First Year Rep",
    name: "Vacant",
    note: "This role is open for a new member to step in.",
    image: "assets/headshots/first-year.png",
  },
];

const committeeGrid = document.querySelector("#committee-grid");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const depthGauge = document.querySelector(".depth-gauge");
const depthGaugeTicks = document.querySelector("#depth-gauge-ticks");
const depthGaugeValue = document.querySelector("#depth-gauge-value");
const bubbleStream = document.querySelector("#bubble-stream");

const randomStarCount = () => Math.floor(Math.random() * 3) + 1;

const committeeLoopCopies = 3;
const repeatedCommitteeMembers = Array.from({ length: committeeLoopCopies }, () => committeeMembers).flat();

const renderCommittee = () => {
  if (!committeeGrid) return;

  committeeGrid.setAttribute("aria-label", "Committee carousel");

  committeeGrid.innerHTML = repeatedCommitteeMembers
    .map((member) => {
      const starCount = randomStarCount();

      return `
        <article class="committee-card">
          <div class="committee-photo">
            <div class="committee-stars" aria-hidden="true">
              ${Array.from(
                { length: starCount },
                () => '<img class="committee-star" src="assets/ui/star.png" alt="" loading="lazy" />'
              ).join("")}
            </div>
            <img class="committee-headshot" src="${member.image}" alt="${member.name} headshot" loading="lazy" />
          </div>
          <div class="committee-body">
            <p class="committee-role">${member.role}</p>
            <h3 class="committee-name">${member.name}</h3>
            <p class="committee-note">${member.note}</p>
          </div>
        </article>
      `;
    })
    .join("");

  committeeGrid.querySelectorAll(".committee-headshot").forEach((image) => {
    image.addEventListener("error", () => {
      image.hidden = true;
    });
  });
};

const setupCommitteeCarousel = () => {
  if (!committeeGrid) return;

  let animationFrame = null;
  let autoScrollRemainder = 0;
  const speed = 0.28;

  const getLoopWidth = () => committeeGrid.scrollWidth / committeeLoopCopies;

  const normalizeScrollPosition = () => {
    const loopWidth = getLoopWidth();
    if (!loopWidth) return;

    if (committeeGrid.scrollLeft < loopWidth * 0.5) {
      committeeGrid.scrollLeft += loopWidth;
    } else if (committeeGrid.scrollLeft > loopWidth * 1.5) {
      committeeGrid.scrollLeft -= loopWidth;
    }
  };

  const tick = () => {
    normalizeScrollPosition();

    if (committeeGrid.scrollWidth > committeeGrid.clientWidth) {
      autoScrollRemainder += speed;
      const moveBy =
        autoScrollRemainder > 0 ? Math.floor(autoScrollRemainder) : Math.ceil(autoScrollRemainder);

      if (moveBy !== 0) {
        committeeGrid.scrollLeft += moveBy;
        autoScrollRemainder -= moveBy;
      }
    }

    animationFrame = window.requestAnimationFrame(tick);
  };

  const centerCarousel = () => {
    const loopWidth = getLoopWidth();
    if (!loopWidth) return;
    committeeGrid.scrollLeft = loopWidth;
  };
  window.addEventListener("resize", centerCarousel);

  centerCarousel();

  animationFrame = window.requestAnimationFrame(tick);
};

const setupMenu = () => {
  if (!menuToggle || !siteNav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
};

const setupHeaderVisibility = () => {
  if (!siteHeader) return;

  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    if (currentScrollY <= 24) {
      siteHeader.classList.remove("is-hidden");
      return;
    }

    if (Math.abs(delta) < 4) return;

    siteHeader.classList.toggle("is-hidden", delta > 0);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
};

const setupDepthGauge = () => {
  if (!depthGauge || !depthGaugeTicks || !depthGaugeValue) return;

  const tickCount = 32;
  const maxDepthMeters = 42;
  let currentDepth = 0;
  let currentTilt = -80;
  let targetDepth = 0;
  let targetTilt = -80;
  let animationFrame = null;

  depthGaugeTicks.innerHTML = Array.from({ length: tickCount }, (_, index) => {
    const ratio = index / (tickCount - 1);
    const angle = ratio * 360;
    const isMajor = index % 4 === 0;

    return `<span class="depth-gauge-tick${isMajor ? " is-major" : ""}" style="--tick-angle: ${angle}deg"></span>`;
  }).join("");

  const tickElements = Array.from(depthGaugeTicks.children);

  const syncToScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

    targetDepth = progress * maxDepthMeters;
    targetTilt = -80 + progress * 160;
  };

  const updateTicks = (depth) => {
    const activeCount = Math.round((depth / maxDepthMeters) * (tickCount - 1));

    tickElements.forEach((tick, index) => {
      tick.classList.toggle("is-active", index <= activeCount);
    });
  };

  const animate = () => {
    currentDepth += (targetDepth - currentDepth) * 0.18;
    currentTilt += (targetTilt - currentTilt) * 0.2;

    depthGaugeTicks.style.setProperty("--gauge-tilt", `${currentTilt.toFixed(2)}deg`);
    depthGaugeValue.textContent = `${Math.round(currentDepth)}`;
    updateTicks(currentDepth);

    animationFrame = window.requestAnimationFrame(animate);
  };

  syncToScroll();

  window.addEventListener("scroll", syncToScroll, { passive: true });
  window.addEventListener("resize", syncToScroll);

  animationFrame = window.requestAnimationFrame(animate);
};

const setupScrollBubbles = () => {
  if (!bubbleStream) return;

  let lastScrollY = window.scrollY;
  let lastSpawnTime = 0;

  const spawnBubble = (strength = 1) => {
    const bubble = document.createElement("span");
    const size = 8 + Math.random() * 18 * Math.min(strength, 1.6);
    const duration = 3.6 + Math.random() * 2.3;
    const drift = -40 + Math.random() * 80;
    const startX = 10 + Math.random() * 80;

    bubble.className = "scroll-bubble";
    bubble.style.left = `${startX}%`;
    bubble.style.setProperty("--bubble-size", `${size.toFixed(1)}px`);
    bubble.style.setProperty("--bubble-duration", `${duration.toFixed(2)}s`);
    bubble.style.setProperty("--bubble-drift", `${drift.toFixed(1)}px`);

    bubble.addEventListener("animationend", () => {
      bubble.remove();
    });

    bubbleStream.appendChild(bubble);
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    if (delta <= 2) return;

    const now = performance.now();
    if (now - lastSpawnTime < 110) return;

    lastSpawnTime = now;
    const strength = Math.min(delta / 42, 1.5);
    const burstCount = Math.max(1, Math.min(3, Math.round(strength * 1.6)));

    for (let index = 0; index < burstCount; index += 1) {
      spawnBubble(strength);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
};

renderCommittee();
setupMenu();
setupHeaderVisibility();
setupCommitteeCarousel();
setupDepthGauge();
setupScrollBubbles();
