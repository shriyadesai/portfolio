// ==========================================================================
// Custom Cursor Logic with Smooth LERP
// ==========================================================================

const cursor = document.getElementById('custom-cursor');
const cursorTrail = document.getElementById('custom-cursor-trail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

const lerpFactor = 0.15;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;
});

function animateTrail() {
  trailX += (mouseX - trailX) * lerpFactor;
  trailY += (mouseY - trailY) * lerpFactor;
  cursorTrail.style.left = `${trailX}px`;
  cursorTrail.style.top = `${trailY}px`;
  requestAnimationFrame(animateTrail);
}
animateTrail();

window.addEventListener('mousedown', () => {
  cursor.classList.add('click-active');
  cursorTrail.classList.add('click-active');
});

window.addEventListener('mouseup', () => {
  cursor.classList.remove('click-active');
  cursorTrail.classList.remove('click-active');
});

function setupCursorHover(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      cursorTrail.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      cursorTrail.classList.remove('hovering');
    });
  });
}

function refreshCursorHover() {
  setupCursorHover('a');
  setupCursorHover('button');
  setupCursorHover('.exp-card');
  setupCursorHover('.project-card');
  setupCursorHover('.timeline-node');
  setupCursorHover('.skill-bubble');
  setupCursorHover('.faq-question');
}
refreshCursorHover();


// ==========================================================================
// Horizontal Scroll Framework
// ==========================================================================

const scrollContainer = document.getElementById('scroll-container');
const scrollWrapper = document.getElementById('scroll-wrapper');
const slides = document.querySelectorAll('.slide');
const timelineNodes = document.querySelectorAll('.timeline-node');
const timelineProgress = document.getElementById('timeline-progress');

let currentSlideIndex = 0;

scrollContainer.addEventListener('wheel', (e) => {
  const activeSlide = slides[currentSlideIndex];
  if (activeSlide) {
    const hasVerticalOverflow = activeSlide.scrollHeight > activeSlide.clientHeight;
    
    if (hasVerticalOverflow) {
      const isScrollEnd = activeSlide.scrollTop + activeSlide.clientHeight >= activeSlide.scrollHeight - 8;
      const isScrollTop = activeSlide.scrollTop <= 5;
      
      if (e.deltaY > 0 && !isScrollEnd) return;
      if (e.deltaY < 0 && !isScrollTop) return;
    }
  }

  e.preventDefault();
  scrollContainer.scrollLeft += (e.deltaY + e.deltaX) * 0.85;
}, { passive: false });

scrollContainer.addEventListener('scroll', () => {
  const scrollWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
  const currentScroll = scrollContainer.scrollLeft;
  
  const progressPercent = scrollWidth > 0 ? (currentScroll / scrollWidth) * 100 : 0;
  timelineProgress.style.width = `${progressPercent}%`;
  
  let activeIndex = 0;
  const widthOfSlide = window.innerWidth;
  activeIndex = Math.round(currentScroll / widthOfSlide);
  
  if (activeIndex !== currentSlideIndex && activeIndex >= 0 && activeIndex < slides.length) {
    currentSlideIndex = activeIndex;
    updateTimelineUI(currentSlideIndex);
  }
});

function updateTimelineUI(index) {
  timelineNodes.forEach((node, i) => {
    if (i === index) {
      node.classList.add('active');
    } else {
      node.classList.remove('active');
    }
  });
}

timelineNodes.forEach((node) => {
  node.addEventListener('click', () => {
    const index = parseInt(node.getAttribute('data-index'));
    scrollToSlideIndex(index);
  });
});

document.getElementById('slide-prev').addEventListener('click', () => {
  if (currentSlideIndex > 0) scrollToSlideIndex(currentSlideIndex - 1);
});

document.getElementById('slide-next').addEventListener('click', () => {
  if (currentSlideIndex < slides.length - 1) scrollToSlideIndex(currentSlideIndex + 1);
});

function scrollToSlideIndex(index) {
  const slideWidth = window.innerWidth;
  scrollContainer.scrollTo({
    left: index * slideWidth,
    behavior: 'smooth'
  });
  currentSlideIndex = index;
  updateTimelineUI(index);
}

document.querySelectorAll('.scroll-to-slide').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const targetSlide = document.getElementById(targetId);
    if (targetSlide) {
      const index = Array.from(slides).indexOf(targetSlide);
      if (index !== -1) scrollToSlideIndex(index);
    }
  });
});

let isDown = false;
let startX;
let scrollLeftPos;

scrollContainer.addEventListener('mousedown', (e) => {
  if (e.target.closest('button, a, .exp-card, .project-card, .skill-bubble, .faq-question')) return;
  isDown = true;
  startX = e.pageX - scrollContainer.offsetLeft;
  scrollLeftPos = scrollContainer.scrollLeft;
});

scrollContainer.addEventListener('mouseleave', () => { isDown = false; });
scrollContainer.addEventListener('mouseup', () => { isDown = false; });

scrollContainer.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.offsetLeft;
  const walk = (x - startX) * 1.5;
  scrollContainer.scrollLeft = scrollLeftPos - walk;
});


// ==========================================================================
// Typewriter Animation
// ==========================================================================

const typewriterSpan = document.getElementById('typewriter-text');
const phrases = [
  "a Product Marketing Manager 📣",
  "an AI Product Builder 🤖",
  "a Dartmouth MEM Student 🎒"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 90;

function type() {
  const currentPhrase = phrases[phraseIndex];
  
  if (isDeleting) {
    typewriterSpan.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 40;
  } else {
    typewriterSpan.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 90;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typeSpeed = 2000;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 500;
  }

  setTimeout(type, typeSpeed);
}

window.addEventListener('load', () => {
  setTimeout(type, 1000);
});


// ==========================================================================
// Mode Switcher (Day: PMM/GTM vs Night: AI/Builder)
// ==========================================================================

const modeToggle = document.getElementById('mode-toggle');
const toggleIcon = document.getElementById('toggle-icon');
const toggleLabel = document.getElementById('toggle-label');
const heroIllustration = document.getElementById('hero-illustration');

modeToggle.addEventListener('click', () => {
  if (document.body.classList.contains('day-mode')) {
    document.body.classList.remove('day-mode');
    document.body.classList.add('night-mode');
    toggleIcon.textContent = "🌙";
    toggleLabel.textContent = "Night Mode";
  } else {
    document.body.classList.remove('night-mode');
    document.body.classList.add('day-mode');
    toggleIcon.textContent = "☀️";
    toggleLabel.textContent = "Day Mode";
  }
});


// ==========================================================================
// FAQs Accordion
// ==========================================================================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.parentElement;
    const answer = parent.querySelector('.faq-answer');
    const toggle = btn.querySelector('.faq-toggle');
    const isActive = parent.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
      item.querySelector('.faq-answer').style.display = 'none';
      item.querySelector('.faq-toggle').textContent = '+';
    });

    if (!isActive) {
      parent.classList.add('active');
      answer.style.display = 'block';
      toggle.textContent = '−';
    }
  });
});


// ==========================================================================
// Experience & Projects Modal Dialogs Data
// ==========================================================================

const expData = {
  applied: {
    company: "Applied Materials",
    role: "Product Marketing Manager Intern, VSE Business Unit",
    location: "Gloucester, MA (Jun 2026 - Present)",
    bullets: [
      "Own the go-to-market (GTM) strategy and cross-functional rollout of Smart NSO (NSO 360) as the focal point across California and Massachusetts teams.",
      "Unified opportunity intelligence from 3+ disparate systems (Excel, SAP CRM, Agile tooling) into a single source of truth for the VSE ion-implant sales organization.",
      "Built the platform's automation and data-aggregation layer into a sales-enablement engine that surfaces qualified upgrade leads and accelerates install-base upsell."
    ]
  },
  deloitte: {
    company: "Deloitte USI Consulting",
    role: "Analyst, Customer & Marketing",
    location: "Bengaluru, India (Sep 2024 - Aug 2025)",
    bullets: [
      "Delivered concurrent workstreams across engineering, data, and business teams to execute roadmap initiatives for an $800M healthcare client across 40+ Jira epics.",
      "Owned Salesforce pipeline hygiene across 150+ work items, analyzing product metrics to improve delivery forecasting, dependency tracking, and release-readiness visibility.",
      "Drove post-launch analysis contributing to a 20% reduction in post-release defects.",
      "Awarded a SPOT Award for process improvements that cut onboarding delays by 50%."
    ]
  },
  stride: {
    company: "Stride AI",
    role: "Product Manager & Co-Founder",
    location: "Bengaluru, India (Jan 2023 - Dec 2023)",
    bullets: [
      "Co-founded and led product for an AI-powered talent intelligence platform from ideation to launch, running 1,000+ discovery interviews to validate product-market fit.",
      "Built AI/NLP matching algorithms (LLMs) for skills-based candidate evaluation.",
      "Earned Top 30 of 625 teams nationally for prototype execution."
    ]
  }
};

const projectData = {
  sap: {
    title: "AI Prototyping Lab",
    subtitle: "SAP Experience Garage (AI Product Manager)",
    bullets: [
      "Led product for a high-fidelity, SAP-native prototype of an idea-evaluation lab for SAP's 50,000-member Experience Garage.",
      "Designed a six-dimension weighted scoring framework with an LLM evaluation layer and deterministic Python pipeline that auto-scores and routes submitted ideas.",
      "Benchmarked 24 AI prototyping tools to guide buy-vs-build strategy recommendations for executive sponsors."
    ]
  },
  emrld: {
    title: "EMRLD Platform",
    subtitle: "AI-Powered Medical Education Platform",
    bullets: [
      "Led product strategy through PRDs, user stories, and positioning frameworks.",
      "Ran a weighted cost-capability vendor evaluation that reduced projected development costs by 66–72%."
    ]
  },
  syllabit: {
    title: "SyllaBit",
    subtitle: "Personalized Learning Tool",
    bullets: [
      "Built an AI-driven learning tool for students with ADHD and others who need specialized learning support.",
      "Designed around a syllabus-to-action North Star Metric.",
      "Won 1st place at the Johns Hopkins Product Management Hackathon."
    ]
  }
};

window.openExpModal = function(id) {
  const data = expData[id];
  if (!data) return;
  
  const content = `
    <h2>${data.company}</h2>
    <h3>${data.role}</h3>
    <p style="font-weight: 500; font-size: 0.95rem; color: var(--accent-secondary); margin-bottom: 20px;">${data.location}</p>
    <ul>
      ${data.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
    </ul>
  `;
  
  document.getElementById('exp-modal-content').innerHTML = content;
  document.getElementById('exp-modal').classList.add('open');
  refreshCursorHover();
};

window.openProjectModal = function(id) {
  const data = projectData[id];
  if (!data) return;
  
  const content = `
    <h2>${data.title}</h2>
    <h3>${data.subtitle}</h3>
    <ul>
      ${data.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
    </ul>
  `;
  
  document.getElementById('project-modal-content').innerHTML = content;
  document.getElementById('project-modal').classList.add('open');
  refreshCursorHover();
};

window.closeModals = function() {
  document.getElementById('exp-modal').classList.remove('open');
  document.getElementById('project-modal').classList.remove('open');
};

document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModals();
  });
});


// ==========================================================================
// Interactive Skills Bubble Playground (Draggable + Collisions Physics)
// ==========================================================================

const sandbox = document.getElementById('playground-sandbox');
const bubbles = Array.from(document.querySelectorAll('.skill-bubble'));
const legendTags = document.querySelectorAll('.legend-tag');
const clearBtn = document.getElementById('clear-bubbles');

let bubbleData = [];
let activeDragBubble = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

const speedLimit = 1.5;
const friction = 0.99;
const floatDrift = 0.04;

function initPhysics() {
  const rect = sandbox.getBoundingClientRect();
  const w = rect.width > 200 ? rect.width : 900;
  const h = rect.height > 100 ? rect.height : 340;
  
  const count = bubbles.length;
  const cols = Math.ceil(Math.sqrt(count * (w / h)));
  const rows = Math.ceil(count / cols);
  const cellW = w / cols;
  const cellH = h / rows;
  
  bubbles.forEach((el, index) => {
    const width = el.offsetWidth || 120;
    const height = el.offsetHeight || 45;
    
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    const jitterX = (Math.random() - 0.5) * (cellW * 0.25);
    const jitterY = (Math.random() - 0.5) * (cellH * 0.25);
    let x = col * cellW + (cellW - width) / 2 + jitterX;
    let y = row * cellH + (cellH - height) / 2 + jitterY;
    
    x = Math.max(8, Math.min(w - width - 8, x));
    y = Math.max(8, Math.min(h - height - 8, y));
    
    const vx = (Math.random() - 0.5) * 0.8;
    const vy = (Math.random() - 0.5) * 0.8;
    
    bubbleData.push({
      el: el,
      index: index,
      width: width,
      height: height,
      radius: Math.max(width, height) / 2,
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      isDragged: false
    });
    
    el.style.left = '0';
    el.style.top = '0';
    el.style.transform = `translate(${x}px, ${y}px)`;
    
    el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      activeDragBubble = bubbleData[index];
      activeDragBubble.isDragged = true;
      activeDragBubble.vx = 0;
      activeDragBubble.vy = 0;
      
      const bubbleRect = el.getBoundingClientRect();
      dragOffsetX = e.clientX - bubbleRect.left;
      dragOffsetY = e.clientY - bubbleRect.top;
      el.style.zIndex = '50';
    });
  });
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// AABB collision: stable for wide pill-shaped bubbles (no circle clumping)
function resolveCollision(b1, b2) {
  const overlapX = Math.min(b1.x + b1.width,  b2.x + b2.width)  - Math.max(b1.x, b2.x);
  const overlapY = Math.min(b1.y + b1.height, b2.y + b2.height) - Math.max(b1.y, b2.y);
  if (overlapX <= 0 || overlapY <= 0) return;

  const m1 = b1.isDragged ? 0 : 1;   // a dragged bubble is immovable
  const m2 = b2.isDragged ? 0 : 1;
  const total = (m1 + m2) || 1;

  if (overlapX < overlapY) {
    const dir = (b1.x + b1.width / 2) < (b2.x + b2.width / 2) ? -1 : 1;
    b1.x += dir * overlapX * (m1 / total);
    b2.x -= dir * overlapX * (m2 / total);
    if (m1 && m2) { const t = b1.vx; b1.vx = b2.vx * 0.7; b2.vx = t * 0.7; }
    else if (m1)  { b1.vx = -b1.vx * 0.6 + dir * 0.25; }
    else if (m2)  { b2.vx = -b2.vx * 0.6 - dir * 0.25; }
  } else {
    const dir = (b1.y + b1.height / 2) < (b2.y + b2.height / 2) ? -1 : 1;
    b1.y += dir * overlapY * (m1 / total);
    b2.y -= dir * overlapY * (m2 / total);
    if (m1 && m2) { const t = b1.vy; b1.vy = b2.vy * 0.7; b2.vy = t * 0.7; }
    else if (m1)  { b1.vy = -b1.vy * 0.6 + dir * 0.25; }
    else if (m2)  { b2.vy = -b2.vy * 0.6 - dir * 0.25; }
  }
}

function updatePhysics() {
  const rect = sandbox.getBoundingClientRect();
  const w = rect.width  > 200 ? rect.width  : 900;
  const h = rect.height > 100 ? rect.height : 340;

  // 1. Dragged bubble follows the pointer + records a throw velocity
  if (activeDragBubble && activeDragBubble.isDragged) {
    const sb = sandbox.getBoundingClientRect();
    const prevX = activeDragBubble.x, prevY = activeDragBubble.y;
    activeDragBubble.x = clamp(mouseX - sb.left - dragOffsetX, 0, w - activeDragBubble.width);
    activeDragBubble.y = clamp(mouseY - sb.top  - dragOffsetY, 0, h - activeDragBubble.height);
    activeDragBubble.vx = (activeDragBubble.x - prevX) * 0.5;
    activeDragBubble.vy = (activeDragBubble.y - prevY) * 0.5;
  }

  // 2. Resolve every pair once
  for (let i = 0; i < bubbleData.length; i++)
    for (let j = i + 1; j < bubbleData.length; j++)
      resolveCollision(bubbleData[i], bubbleData[j]);

  // 3. Integrate everything that isn't being dragged
  for (const b of bubbleData) {
    if (b.isDragged) continue;

    if (b.x <= 0) { b.x = 0; b.vx = Math.abs(b.vx); }
    else if (b.x + b.width >= w) { b.x = w - b.width; b.vx = -Math.abs(b.vx); }
    if (b.y <= 0) { b.y = 0; b.vy = Math.abs(b.vy); }
    else if (b.y + b.height >= h) { b.y = h - b.height; b.vy = -Math.abs(b.vy); }

    b.vx += (Math.random() - 0.5) * floatDrift;
    b.vy += (Math.random() - 0.5) * floatDrift;
    b.vx *= friction;  b.vy *= friction;
    b.vx = clamp(b.vx, -speedLimit, speedLimit);
    b.vy = clamp(b.vy, -speedLimit, speedLimit);

    b.x = clamp(b.x + b.vx, 0, w - b.width);
    b.y = clamp(b.y + b.vy, 0, h - b.height);
  }

  // 4. Paint
  for (const b of bubbleData) b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;

  requestAnimationFrame(updatePhysics);
}

window.addEventListener('mouseup', () => {
  if (activeDragBubble) {
    activeDragBubble.isDragged = false;
    activeDragBubble.el.style.zIndex = '';
    activeDragBubble = null;
  }
});

setTimeout(() => {
  initPhysics();
  updatePhysics();
}, 400);

legendTags.forEach(tag => {
  tag.addEventListener('click', () => {
    const category = tag.getAttribute('data-filter');
    const isActive = tag.classList.contains('active');
    legendTags.forEach(t => t.classList.remove('active'));
    
    if (isActive) {
      bubbleData.forEach(b => {
        b.el.classList.remove('dimmed');
        b.el.classList.remove('highlighted');
      });
    } else {
      tag.classList.add('active');
      bubbleData.forEach(b => {
        const bubbleCategory = b.el.getAttribute('data-category');
        if (bubbleCategory === category) {
          b.el.classList.remove('dimmed');
          b.el.classList.add('highlighted');
        } else {
          b.el.classList.add('dimmed');
          b.el.classList.remove('highlighted');
        }
      });
    }
  });
});

clearBtn.addEventListener('click', () => {
  legendTags.forEach(t => t.classList.remove('active'));
  bubbleData.forEach(b => {
    b.el.classList.remove('dimmed');
    b.el.classList.remove('highlighted');
    b.vx = (Math.random() - 0.5) * 5;
    b.vy = (Math.random() - 0.5) * 5;
  });
});
