// ==========================================================================
   // Custom Cursor Logic with Smooth LERP
   // ==========================================================================

   const cursor = document.getElementById('custom-cursor');
   const cursorTrail = document.getElementById('custom-cursor-trail');

   let mouseX = 0, mouseY = 0; // Actual mouse position
   let trailX = 0, trailY = 0;   // Trail position (lagging behind)

   // Lerp factor (linear interpolation: 0.15 = 15% travel per frame)
   const lerpFactor = 0.15;

   window.addEventListener('mousemove', (e) => {
     mouseX = e.clientX;
     mouseY = e.clientY;
     
     // Move core cursor immediately
     cursor.style.left = `${mouseX}px`;
     cursor.style.top = `${mouseY}px`;
   });

   // Animating the trail with Lerp
   function animateTrail() {
     trailX += (mouseX - trailX) * lerpFactor;
     trailY += (mouseY - trailY) * lerpFactor;
     
     cursorTrail.style.left = `${trailX}px`;
     cursorTrail.style.top = `${trailY}px`;
     
     requestAnimationFrame(animateTrail);
   }
   animateTrail();

   // Mouse interactions
   window.addEventListener('mousedown', () => {
     cursor.classList.add('click-active');
     cursorTrail.classList.add('click-active');
   });

   window.addEventListener('mouseup', () => {
     cursor.classList.remove('click-active');
     cursorTrail.classList.remove('click-active');
   });

   // Hover states for elements
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

   // Initialize hover listeners
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

   // Translate Vertical Scroll Wheel to Horizontal Movement
   scrollContainer.addEventListener('wheel', (e) => {
     e.preventDefault();
     // Smooth scrolling translation
     scrollContainer.scrollLeft += e.deltaY * 0.85;
   });

   // Sync timeline nodes and progress bar on scroll
   scrollContainer.addEventListener('scroll', () => {
     const scrollWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
     const currentScroll = scrollContainer.scrollLeft;
     
     // Update progress line percentage
     const progressPercent = scrollWidth > 0 ? (currentScroll / scrollWidth) * 100 : 0;
     timelineProgress.style.width = `${progressPercent}%`;
     
     // Determine active slide index
     let activeIndex = 0;
     const widthOfSlide = window.innerWidth;
     
     // Round to closest slide
     activeIndex = Math.round(currentScroll / widthOfSlide);
     
     if (activeIndex !== currentSlideIndex && activeIndex >= 0 && activeIndex < slides.length) {
       currentSlideIndex = activeIndex;
       updateTimelineUI(currentSlideIndex);
     }
   });

   // Update timeline dot styling
   function updateTimelineUI(index) {
     timelineNodes.forEach((node, i) => {
       if (i === index) {
         node.classList.add('active');
       } else {
         node.classList.remove('active');
       }
     });
   }

   // Clicking timeline nodes navigates to slide
   timelineNodes.forEach((node) => {
     node.addEventListener('click', () => {
       const index = parseInt(node.getAttribute('data-index'));
       scrollToSlideIndex(index);
     });
   });

   // Arrow Navigation controls
   document.getElementById('slide-prev').addEventListener('click', () => {
     if (currentSlideIndex > 0) {
       scrollToSlideIndex(currentSlideIndex - 1);
     }
   });

   document.getElementById('slide-next').addEventListener('click', () => {
     if (currentSlideIndex < slides.length - 1) {
       scrollToSlideIndex(currentSlideIndex + 1);
     }
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

   // Handle slide buttons inside page
   document.querySelectorAll('.scroll-to-slide').forEach(btn => {
     btn.addEventListener('click', () => {
       const targetId = btn.getAttribute('data-target');
       const targetSlide = document.getElementById(targetId);
       if (targetSlide) {
         const index = Array.from(slides).indexOf(targetSlide);
         if (index !== -1) {
           scrollToSlideIndex(index);
         }
       }
     });
   });

   // Touch swipe drag mapping for horizontal scroll
   let isDown = false;
   let startX;
   let scrollLeft;

   scrollContainer.addEventListener('mousedown', (e) => {
     // Only trigger drag if we click directly on backgrounds/containers, not interactive cards
     if (e.target.closest('button, a, .exp-card, .project-card, .skill-bubble, .faq-question')) return;
     isDown = true;
     startX = e.pageX - scrollContainer.offsetLeft;
     scrollLeft = scrollContainer.scrollLeft;
   });

   scrollContainer.addEventListener('mouseleave', () => {
     isDown = false;
   });

   scrollContainer.addEventListener('mouseup', () => {
     isDown = false;
   });

   scrollContainer.addEventListener('mousemove', (e) => {
     if (!isDown) return;
     e.preventDefault();
     const x = e.pageX - scrollContainer.offsetLeft;
     const walk = (x - startX) * 1.5; // scroll speed multiplier
     scrollContainer.scrollLeft = scrollLeft - walk;
   });


   // ==========================================================================
   // Typewriter Animation
   // ==========================================================================

   const typewriterSpan = document.getElementById('typewriter-text');
   const phrases = [
     "a Product Marketing Manager 📣",
     "an AI Product Builder 🤖",
     "a Dartmouth MEM Student 🎒",
     "a Stride AI Co-Founder 🚀"
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
       typeSpeed = 40; // Deleting is faster
     } else {
       typewriterSpan.textContent = currentPhrase.substring(0, charIndex + 1);
       charIndex++;
       typeSpeed = 90;
     }

     if (!isDeleting && charIndex === currentPhrase.length) {
       // Pause at complete word
       isDeleting = true;
       typeSpeed = 2000; 
     } else if (isDeleting && charIndex === 0) {
       isDeleting = false;
       phraseIndex = (phraseIndex + 1) % phrases.length;
       typeSpeed = 500; // Pause before typing next word
     }

     setTimeout(type, typeSpeed);
   }

   // Start typewriter loop after window load
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
       // Switch to Night Mode (AI Focus)
       document.body.classList.remove('day-mode');
       document.body.classList.add('night-mode');
       
       toggleIcon.textContent = "🌙";
       toggleLabel.textContent = "Night Mode";
       heroIllustration.innerHTML = '<div class="illustration-face">🤖</div>';
       
       // Switch typewriter phrases or themes
     } else {
       // Switch to Day Mode (PMM Focus)
       document.body.classList.remove('night-mode');
       document.body.classList.add('day-mode');
       
       toggleIcon.textContent = "☀️";
       toggleLabel.textContent = "Day Mode";
       heroIllustration.innerHTML = '<div class="illustration-face">😊</div>';
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

       // Close all FAQs first
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

   // Close modal on click outside box
   document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
     backdrop.addEventListener('click', (e) => {
       if (e.target === backdrop) {
         closeModals();
       }
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

   // Setup physics parameters
   const speedLimit = 1.5;
   const friction = 0.99; // Keep movement rolling but slightly dampened
   const floatDrift = 0.05; // Gentle random force

   // Initialize physics details for each bubble
   function initPhysics() {
     const rect = sandbox.getBoundingClientRect();
     
     bubbles.forEach((el, index) => {
       // Random positions within sandbox
       const width = el.offsetWidth;
       const height = el.offsetHeight;
       
       const x = Math.random() * (rect.width - width - 40) + 20;
       const y = Math.random() * (rect.height - height - 40) + 20;
       
       // Random soft starting velocities
       const vx = (Math.random() - 0.5) * 1.0;
       const vy = (Math.random() - 0.5) * 1.0;
       
       bubbleData.push({
         el: el,
         index: index,
         width: width,
         height: height,
         radius: width / 2, // Approximate circular collision
         x: x,
         y: y,
         vx: vx,
         vy: vy,
         isDragged: false
       });
       
       el.style.left = '0';
       el.style.top = '0';
       el.style.transform = `translate(${x}px, ${y}px)`;
       
       // Drag Event listeners
       el.addEventListener('mousedown', (e) => {
         e.preventDefault();
         activeDragBubble = bubbleData[index];
         activeDragBubble.isDragged = true;
         activeDragBubble.vx = 0;
         activeDragBubble.vy = 0;
         
         const bubbleRect = el.getBoundingClientRect();
         dragOffsetX = e.clientX - bubbleRect.left;
         dragOffsetY = e.clientY - bubbleRect.top;
       });
     });
   }

   // Update positions, wall bounces, and basic bubble-to-bubble elastic collision resolution
   function updatePhysics() {
     const rect = sandbox.getBoundingClientRect();
     if (rect.width === 0) {
       requestAnimationFrame(updatePhysics);
       return; // Handle unrendered state
     }

     // Handle drag positioning
     if (activeDragBubble && activeDragBubble.isDragged) {
       const sandboxRect = sandbox.getBoundingClientRect();
       const prevX = activeDragBubble.x;
       const prevY = activeDragBubble.y;
       
       // Calculate new coordinates relative to sandbox parent container
       activeDragBubble.x = mouseX - sandboxRect.left - dragOffsetX;
       activeDragBubble.y = mouseY - sandboxRect.top - dragOffsetY;
       
       // Constrain drag to sandbox limits
       activeDragBubble.x = Math.max(0, Math.min(rect.width - activeDragBubble.width, activeDragBubble.x));
       activeDragBubble.y = Math.max(0, Math.min(rect.height - activeDragBubble.height, activeDragBubble.y));
       
       // Set dynamic throw velocities based on motion
       activeDragBubble.vx = (activeDragBubble.x - prevX) * 0.6;
       activeDragBubble.vy = (activeDragBubble.y - prevY) * 0.6;
     }

     // Solve bubble to bubble collisions (Elastic overlaps)
     for (let i = 0; i < bubbleData.length; i++) {
       const b1 = bubbleData[i];
       if (b1.isDragged) continue;

       // Wall collisions
       if (b1.x <= 0) {
         b1.x = 0;
         b1.vx = Math.abs(b1.vx);
       } else if (b1.x + b1.width >= rect.width) {
         b1.x = rect.width - b1.width;
         b1.vx = -Math.abs(b1.vx);
       }

       if (b1.y <= 0) {
         b1.y = 0;
         b1.vy = Math.abs(b1.vy);
       } else if (b1.y + b1.height >= rect.height) {
         b1.y = rect.height - b1.height;
         b1.vy = -Math.abs(b1.vy);
       }

       // Solve collisions against other bubbles
       for (let j = i + 1; j < bubbleData.length; j++) {
         const b2 = bubbleData[j];
         
         // Calculate center points
         const c1x = b1.x + b1.width / 2;
         const c1y = b1.y + b1.height / 2;
         const c2x = b2.x + b2.width / 2;
         const c2y = b2.y + b2.height / 2;
         
         const dx = c2x - c1x;
         const dy = c2y - c1y;
         const dist = Math.sqrt(dx * dx + dy * dy);
         
         const minDist = b1.radius + b2.radius;
         
         if (dist < minDist && dist > 0) {
           // Overlap distance
           const overlap = minDist - dist;
           
           // Normal collision vectors
           const nx = dx / dist;
           const ny = dy / dist;
           
           // Separate overlapping cards
           if (!b1.isDragged) {
             b1.x -= nx * overlap * 0.5;
             b1.y -= ny * overlap * 0.5;
           }
           if (!b2.isDragged) {
             b2.x += nx * overlap * 0.5;
             b2.y += ny * overlap * 0.5;
           }
           
           // Elastic bouncing velocity reaction
           const kx = b1.vx - b2.vx;
           const ky = b1.vy - b2.vy;
           const p = 2 * (nx * kx + ny * ky) / 2; // Equal weights
           
           if (!b1.isDragged) {
             b1.vx -= p * nx;
             b1.vy -= p * ny;
           }
           if (!b2.isDragged) {
             b2.vx += p * nx;
             b2.vy += p * ny;
           }
         }
       }

       // Apply standard physics velocities and soft drift
       b1.vx += (Math.random() - 0.5) * floatDrift;
       b1.vy += (Math.random() - 0.5) * floatDrift;
       
       // Friction dampening
       b1.vx *= friction;
       b1.vy *= friction;
       
       // Limit max speed
       b1.vx = Math.max(-speedLimit, Math.min(speedLimit, b1.vx));
       b1.vy = Math.max(-speedLimit, Math.min(speedLimit, b1.vy));
       
       // Update coordinates
       b1.x += b1.vx;
       b1.y += b1.vy;
     }

     // Render updates
     bubbleData.forEach(b => {
       b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
     });

     requestAnimationFrame(updatePhysics);
   }

   // Drag release listeners
   window.addEventListener('mouseup', () => {
     if (activeDragBubble) {
       activeDragBubble.isDragged = false;
       activeDragBubble = null;
     }
   });

   // Delay setup slightly to allow rendering height measurements
   setTimeout(() => {
     initPhysics();
     updatePhysics();
   }, 300);


   // Category filter actions
   legendTags.forEach(tag => {
     tag.addEventListener('click', () => {
       const category = tag.getAttribute('data-filter');
       
       // Toggle active style
       const isActive = tag.classList.contains('active');
       legendTags.forEach(t => t.classList.remove('active'));
       
       if (isActive) {
         // Reset filtering
         bubbleData.forEach(b => {
           b.el.classList.remove('dimmed');
           b.el.classList.remove('highlighted');
         });
       } else {
         tag.classList.add('active');
         
         // Apply dimmed and highlighted classes to physics nodes
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
       
       // Randomize velocities for a clean pop/scatter
       b.vx = (Math.random() - 0.5) * 5;
       b.vy = (Math.random() - 0.5) * 5;
     });
   });
