import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// --- 1. 3D SCENE & MODEL SETUP ---
function initThreeJS() {
  // Basic scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg-canvas"),
    alpha: true, // Allows for a transparent background
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 2.5;

  // --- Background Particles ---
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1500;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // --- Lighting ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x007cf0, 10, 10);
  pointLight.position.set(-2, -1, 2);
  scene.add(pointLight);

  // --- Load 3D Model ---
  const loader = new GLTFLoader();
  let model;
  loader.load(
    "https://poly.pizza/download/baked/5723321525534720",
    (gltf) => {
      model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5);
      model.position.y = -0.3;
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("An error occurred while loading the 3D model:", error);
    }
  );

  // --- Animation Loop ---
  const clock = new THREE.Clock();
  let elapsedTime = 0;
  let animationId = null;

  function animate() {
    animationId = requestAnimationFrame(animate);
    // Cap the per-frame delta so a long pause (e.g. hidden tab) doesn't jump
    elapsedTime += Math.min(clock.getDelta(), 0.05);

    // Animate particles
    particlesMesh.rotation.x = elapsedTime * 0.05;
    particlesMesh.rotation.y = elapsedTime * 0.03;

    // Animate the model if loaded
    if (model) {
      model.rotation.y = elapsedTime * 0.2;
      model.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1;
    }

    renderer.render(scene, camera);
  }
  animate();

  // Pause rendering while the tab is hidden to save CPU/GPU/battery
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
      animationId = null;
    } else if (animationId === null) {
      clock.getDelta(); // discard time elapsed while hidden so motion stays smooth
      animate();
    }
  });

  // Handle Window Resizing
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// --- 2. TYPED.JS SETUP ---
function initTypedJS() {
  new Typed("#typed-text", {
    strings: [
      "Building Digital Realities.",
      "Code Meets Creativity.",
      "Interactive Web Experiences.",
    ],
    typeSpeed: 40,
    backSpeed: 20,
    backDelay: 2000,
    loop: true,
  });
}

// --- 3. GSAP ANIMATIONS ---
function initGSAP() {
  // Register the ScrollTrigger plugin so scroll-based animations work
  gsap.registerPlugin(ScrollTrigger);

  // CSS handles all orbit rotation — GSAP only manages the entrance fade-in
  // (orbit-wrapper opacity starts at 0 in CSS)

  // Main Page Load Animation Timeline
  gsap.set(".hero-text .line", { y: "100%" });
  gsap.set(".open-to-work-badge", { opacity: 0, y: -15 });
  gsap.set(".hero-ctas", { opacity: 0, y: 12 });
  gsap.set(".scroll-indicator", { opacity: 0 });
  gsap.set(
    [
      "header",
      ".follow-bar",
      ".hero-text .hero-role",
      ".hero-text .tagline",
      ".profile-image",
    ],
    { opacity: 0 }
  );

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.to(".open-to-work-badge", { opacity: 1, y: 0, duration: 0.8, delay: 0.2 })
    .to(".hero-text .line", { y: "0%", duration: 1.2, stagger: 0.15 }, "-=0.5")
    .to(".hero-text .hero-role", { opacity: 1, duration: 1 }, "-=0.7")
    .to("header", { opacity: 1, duration: 1 }, "-=0.8")
    .to(".follow-bar", { opacity: 1, duration: 1 }, "-=1")
    .to(".hero-text .tagline", { opacity: 1, duration: 1 }, "-=0.5")
    .to(".hero-ctas", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
    .to(".profile-image", { opacity: 1, duration: 1 }, "-=0.7")
    .to(
      ".tech-icon",
      {
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        onComplete: initTimelineAnimations,
      },
      "-=0.8"
    )
    .to(".scroll-indicator", { opacity: 1, duration: 1 }, "-=0.4");
}

// --- 4. TIMELINE ANIMATIONS ---
function initTimelineAnimations() {
  // Experience items animation
  gsap.utils.toArray(".experience-item").forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        toggleActions: "play none none none",
        markers: false, // Set to true for debugging if needed
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: i * 0.2,
    });
  });

  // Timeline bar animation
  ScrollTrigger.create({
    trigger: ".timeline-container",
    start: "top center",
    end: "bottom center",
    onUpdate: (self) => {
      const timelineBar = document.querySelector(".timeline-bar");
      if (timelineBar) {
        timelineBar.style.height = `${self.progress * 100}%`;
      }
    },
    markers: false, // Set to true for debugging if needed
  });
  
}

// --- 5. HAMBURGER MENU ---
function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const navEl = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    navEl.classList.toggle("active");
  });

  // Close menu when any nav link is clicked
  navEl.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navEl.classList.remove("active");
    });
  });

  // Close menu when clicking outside of it
  document.addEventListener("click", (e) => {
    if (!navEl.contains(e.target) && !hamburger.contains(e.target)) {
      navEl.classList.remove("active");
    }
  });
}

// --- 6. ACTIVE NAV HIGHLIGHT ---
function initActiveNav() {
  const sections = document.querySelectorAll("#about, #experiences, #projects, #contact");
  const navBtns = document.querySelectorAll(".cta-button a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navBtns.forEach((btn) => {
            btn.classList.toggle("nav-active", btn.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.25, rootMargin: "-80px 0px -20% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}

// --- 7. STATS COUNT-UP ---
function initStatsCountUp() {
  const numbers = document.querySelectorAll(".stat-number");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(ease * target);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  numbers.forEach((n) => observer.observe(n));
}

// --- INITIALIZE EVERYTHING ---
document.addEventListener("DOMContentLoaded", () => {
  initThreeJS();
  initTypedJS();
  initGSAP();
  initHamburger();
  initActiveNav();
  initStatsCountUp();

  // Refresh ScrollTrigger after all animations are set up
  ScrollTrigger.addEventListener("refresh", () => {
    document.querySelectorAll(".experience-item").forEach((item) => {
      item.style.opacity = "1";
    });
  });
  ScrollTrigger.refresh();
});