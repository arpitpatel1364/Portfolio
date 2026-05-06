/* ============================================================
   ARPIT BHOJANI — PORTFOLIO JS
   ============================================================ */
(function () {
  "use strict";

  /* ── Scroll progress bar ── */
  const sbar = document.getElementById("sbar");
  window.addEventListener("scroll", () => {
    const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const prog = totalScrollableHeight > 0 ? (window.scrollY / totalScrollableHeight) * 100 : 0;
    sbar.style.width = prog + "%";
  }, { passive: true });

  /* ── Preloader ── */
  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("loaded");
    }
  });

  /* ── Theme toggle ── */
  const html = document.documentElement;
  const themeBtn = document.getElementById("themeBtn");
  const saved = localStorage.getItem("ab-theme-v3") || "dark";
  html.setAttribute("data-theme", saved);

  themeBtn.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("ab-theme-v3", next);
  });

  /* ── Mobile hamburger ── */
  const ham = document.getElementById("ham");
  const mob = document.getElementById("mob-menu");

  ham.addEventListener("click", () => {
    const open = mob.classList.toggle("open");
    const spans = ham.querySelectorAll("span");
    if (open) {
      spans[0].style.transform = "rotate(45deg) translate(4px,4px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(4px,-4px)";
    } else {
      spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
    }
  });

  mob.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mob.classList.remove("open");
      ham.querySelectorAll("span").forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
    });
  });

  /* ── Active nav link on scroll ── */
  const navObserverOptions = {
    threshold: 0,
    rootMargin: "-45% 0px -45% 0px"
  };

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll(".nav-link").forEach(link => {
          link.classList.toggle("act", link.getAttribute("href") === "#" + id);
        });
      }
    });
  }, navObserverOptions);

  document.querySelectorAll("section[id]").forEach(section => {
    navObserver.observe(section);
  });

  /* ── Reveal on scroll ── */
  const ro = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("in"), i * 60);
        ro.unobserve(e.target);
      }
    });
  }, { threshold: .06, rootMargin: "0px 0px -24px 0px" });

  document.querySelectorAll(".reveal").forEach(el => ro.observe(el));

  /* ── Diagram tabs ── */
  const dTabs = document.querySelectorAll(".d-tab");
  dTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      dTabs.forEach(t => t.classList.remove("act"));
      document.querySelectorAll(".diag-panel").forEach(p => p.classList.remove("show"));
      tab.classList.add("act");
      const panel = document.getElementById("tab-" + tab.dataset.tab);
      if (panel) panel.classList.add("show");

      // Auto-center active tab
      tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
  });

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
    });
  });

  /* ── Skill card 3D tilt ── */
  document.querySelectorAll(".sk-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      card.style.transform = `perspective(600px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale(1.02)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });

})();

/* ============================================================
   ENHANCEMENTS — nav-on-scroll, back-to-top, keyboard shortcut
   ============================================================ */
(function () {
  "use strict";

  /* Back-to-top button */
  const toTop = document.createElement("button");
  toTop.id = "toTop";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = "↑";
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.body.appendChild(toTop);

  /* Nav shadow on scroll */
  const navEl = document.querySelector("nav");
  const onScroll = () => {
    if (!navEl) return;
    navEl.classList.toggle("scrolled", window.scrollY > 8);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Keyboard shortcut: T toggles theme (ignores when typing) */
  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
    if (e.key === "t" || e.key === "T") {
      const btn = document.getElementById("themeBtn");
      if (btn) btn.click();
    }
  });

  /* Disable 3D tilt on touch devices to avoid sticky hover transforms */
  const isTouch = matchMedia("(hover: none)").matches;
  if (isTouch) {
    document.querySelectorAll(".sk-card").forEach((c) => {
      c.style.transform = "";
      c.replaceWith(c.cloneNode(true)); // strip listeners
    });
  }

  onScroll();
})();

/* ============================================================
   v2 ENHANCEMENTS — Cursor glow, Project spotlight,
   Auto-hide nav, Command palette (⌘K / Ctrl+K)
   ============================================================ */
(function () {
  "use strict";
  const isTouch = matchMedia("(hover: none)").matches;
  const navEl = document.querySelector("nav");

  /* ── 1) Custom cursor (Dot + Ring) ── */
  if (!isTouch) {
    const dot = document.createElement("div");
    dot.id = "cursorDot";
    const ring = document.createElement("div");
    ring.id = "cursorRing";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    // Hide default cursor
    document.body.style.cursor = "none";

    // Smooth movement logic
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    let firstMove = true;
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (firstMove) {
        dotX = ringX = mouseX;
        dotY = ringY = mouseY;
        firstMove = false;
      }
    });

    function animateCursor() {
      // Linear Interpolation (lerp)
      // Dot follows with high speed (almost instant)
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;

      // Ring follows with more smoothing (inertia)
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      dot.style.left = dotX + "px";
      dot.style.top = dotY + "px";
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener("mousedown", () => document.body.classList.add("cursor-active"));
    document.addEventListener("mouseup", () => document.body.classList.remove("cursor-active"));

    // Selection of interactive elements
    const clickables = "a, button, .sk-card, .proj-card, .infra-card, .d-tab, .con-grid a, .nav-logo, .theme-btn";

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(clickables)) {
        document.body.classList.add("cursor-hover");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(clickables)) {
        document.body.classList.remove("cursor-hover");
      }
    });
  }

  /* ── 2) Project card spotlight ── */
  document.querySelectorAll(".proj-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");
    });
  });

  /* ── 3) Auto-hide nav on scroll-down ── */
  let lastY = window.scrollY;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking || !navEl) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const dy = y - lastY;
      if (y > 120 && dy > 6 && !document.getElementById("cmdk-overlay")?.classList.contains("open")) {
        navEl.classList.add("nav-hidden");
      } else if (dy < -4 || y < 80) {
        navEl.classList.remove("nav-hidden");
      }
      lastY = y;
      ticking = false;
    });
  }, { passive: true });

  /* ── 4) Command palette (⌘K / Ctrl+K) ── */
  const commands = [
    { label: "Go to About", icon: "→", action: () => jump("#about") },
    { label: "Go to Skills", icon: "→", action: () => jump("#skills") },
    { label: "Go to Infrastructure", icon: "→", action: () => jump("#infrastructure") },
    { label: "Go to Systems", icon: "→", action: () => jump("#sysdesign") },
    { label: "Go to Projects", icon: "→", action: () => jump("#projects") },
    { label: "Go to Activity", icon: "→", action: () => jump("#activity") },
    { label: "Go to Education", icon: "→", action: () => jump("#education") },
    { label: "Toggle Theme", icon: "◐", kbd: "T", action: () => document.getElementById("themeBtn")?.click() },
    { label: "Copy Email", icon: "✉", action: copyEmail },
    { label: "Email Arpit", icon: "✉", action: () => location.href = "mailto:arpitbhojani.contact@gmail.com" },
    { label: "Scroll to Top", icon: "↑", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
  ];

  function jump(sel) {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
  function copyEmail() {
    const email = "arpitbhojani.contact@gmail.com";
    navigator.clipboard?.writeText(email).then(() => toast("Email copied: " + email));
  }
  function toast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    Object.assign(t.style, {
      position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)",
      background: "var(--text)", color: "var(--bg)", padding: "10px 18px",
      borderRadius: "8px", fontFamily: "DM Mono, monospace", fontSize: "12px",
      letterSpacing: ".05em", zIndex: 10001, opacity: "0", transition: "opacity .3s"
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => t.style.opacity = "1");
    setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 1800);
  }

  // Build palette UI
  const overlay = document.createElement("div");
  overlay.id = "cmdk-overlay";
  overlay.innerHTML = `
    <div id="cmdk" role="dialog" aria-label="Command palette">
      <input id="cmdk-input" type="text" placeholder="Type a command or search..." autocomplete="off" spellcheck="false" />
      <div id="cmdk-list"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector("#cmdk-input");
  const list = overlay.querySelector("#cmdk-list");
  let activeIdx = 0;
  let filtered = commands.slice();

  function render() {
    if (!filtered.length) {
      list.innerHTML = `<div class="cmdk-empty">No commands found</div>`;
      return;
    }
    list.innerHTML = filtered.map((c, i) => `
      <div class="cmdk-item ${i === activeIdx ? "active" : ""}" data-i="${i}">
        <span class="cmdk-ico">${c.icon}</span>
        <span>${c.label}</span>
        ${c.kbd ? `<span class="cmdk-kbd">${c.kbd}</span>` : ""}
      </div>
    `).join("");
    list.querySelectorAll(".cmdk-item").forEach((el) => {
      el.addEventListener("click", () => run(parseInt(el.dataset.i, 10)));
      el.addEventListener("mouseenter", () => {
        activeIdx = parseInt(el.dataset.i, 10);
        list.querySelectorAll(".cmdk-item").forEach((x, i) => x.classList.toggle("active", i === activeIdx));
      });
    });
  }
  function run(i) {
    const c = filtered[i];
    if (!c) return;
    closePalette();
    setTimeout(() => c.action(), 80);
  }
  function openPalette() {
    overlay.classList.add("open");
    input.value = "";
    filtered = commands.slice();
    activeIdx = 0;
    render();
    setTimeout(() => input.focus(), 30);
  }
  function closePalette() {
    overlay.classList.remove("open");
  }

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    filtered = q ? commands.filter(c => c.label.toLowerCase().includes(q)) : commands.slice();
    activeIdx = 0;
    render();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = (activeIdx + 1) % filtered.length; render(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = (activeIdx - 1 + filtered.length) % filtered.length; render(); }
    else if (e.key === "Enter") { e.preventDefault(); run(activeIdx); }
    else if (e.key === "Escape") { closePalette(); }
  });
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closePalette(); });

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      overlay.classList.contains("open") ? closePalette() : openPalette();
    }
  });

  render();
})();

/* ── 5) Scroll-to-explore: add chevron icon + click-to-scroll ── */
(function () {
  const ind = document.querySelector(".scroll-ind");
  if (!ind) return;
  const span = ind.querySelector("span");
  if (span && !ind.querySelector(".scroll-ico")) {
    const ico = document.createElement("span");
    ico.className = "scroll-ico";
    ico.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;
    span.insertAdjacentElement("afterend", ico);
    span.textContent = "Scroll to explore";
  }
  ind.setAttribute("role", "button");
  ind.setAttribute("tabindex", "0");
  ind.setAttribute("aria-label", "Scroll to next section");
  const goNext = () => {
    const target = document.querySelector("#about") ||
      document.querySelector("section[id]:nth-of-type(2)");
    if (target) target.scrollIntoView({ behavior: "smooth" });
    else window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
  };
  ind.addEventListener("click", goNext);
  ind.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goNext(); }
  });
})();

/* ============================================================
   PROJECT MODAL LOGIC & DATA
   ============================================================ */
(function () {
  "use strict";

  const projectsData = {
    "1": {
      idx: "00",
      title: "Sentrix AI",
      subtitle: "Distributed Intelligence Surveillance Mesh",
      desc: "Professional-grade distributed AI surveillance — edge face detection with centralized neural recognition, real-time forensic accuracy across 10+ camera feeds.",
      stack: ["FastAPI", "YOLOv8", "InsightFace", "YOLO-World", "Qdrant", "SSE", "JWT", "ONNX", "Docker", "CUDA"],
      features: [
        "Neural Face Core (512D InsightFace) + Context Core (YOLO-World 80+ classes)",
        "Motion Gating on 160×120 grayscale delta — 70% VRAM reduction",
        "10+ concurrent HD camera feeds from single orchestrator",
        "SSE alert pipeline delivers WANTED alerts in under 200ms",
        "Qdrant vector store + SQLite fallback — identity survives reboots",
        "MJPG-encoded streaming — 60% bandwidth reduction",
        "Autonomous failover & reconnection for worker nodes"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/Sentrix-AI"
    },
    "2": {
      idx: "01",
      title: "Ghost Fetch",
      subtitle: "Silent Web Automation",
      desc: "Navigates paginated directories, simulates human interactions like scrolling and clicking, extracting structured data to CSV. Features smart retry logic, resume support, and rate-limit-safe delays.",
      stack: ["Python 3", "Playwright", "Chromium"],
      features: [
        "Bulk JS reads (querySelectorAll) minimize blocking browser actions",
        "Smart Retry Logic with exponential backoff and randomized jitter",
        "Human-like interactions: Random delays, scroll-into-view, natural click timing",
        "Auto-dismisses cookie popups or falls back to JS DOM manipulation",
        "Checkpoint saving allows safe resume from crashes",
        "Stale DOM detection and automatic listing reloads"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/Ghost-Fetch"
    },
    "3": {
      idx: "03",
      title: "Vision Scribe",
      subtitle: "Multimodal RAG",
      desc: "Production-grade multimodal RAG treating every document page as both text and image. YOLO detects visual regions, Qwen-VL captions them.",
      stack: ["Django REST", "PyTorch", "YOLOv8", "Qwen-VL", "Ollama", "ChromaDB", "BGE-M3", "BM25·RRF"],
      features: [
        "YOLO detects charts, tables, figures; Qwen-VL auto-captions every region",
        "Hybrid dense + sparse retrieval via Reciprocal Rank Fusion",
        "Parallel ingestion via multiprocessing.Pool — 4× speedup",
        "Fully local stack — zero API cost, runs on-device with Ollama",
        "Benchmarked at 16.1 pages/sec with 8 workers",
        "RAGAS evaluation: faithfulness, context recall & answer relevancy"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/VisionScribe"
    },
    "4": {
      idx: "02",
      title: "Nexus AI",
      subtitle: "Distributed Agentic Stack",
      desc: "Distributed edge-intelligence system for real-time vision processing and metadata extraction using Pydantic-AI and Ollama.",
      stack: ["Flask", "Pydantic-AI", "Ollama", "REST/SSE", "Llama 3.2"],
      features: [
        "Clean HTML/JS chat interface with real-time SSE streaming",
        "Flask application layer with async streaming support",
        "Pydantic-AI Agent for dynamic tool-calling and system-prompt injection",
        "Local Ollama runtime serving open-source models",
        "Zero API Cost: Operates entirely locally with fully private LLM instances",
        "Complex task handling: TSP, logic puzzles, data extraction"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/Nexus-AI"
    },
    "5": {
      idx: "07",
      title: "CareerHub",
      subtitle: "Recruitment Ecosystem",
      desc: "Scalable recruitment ecosystem with Three-Tier RBAC. N+1 patterns eliminated with select_related/prefetch.",
      stack: ["Django", "RBAC", "Bootstrap", "PostgreSQL"],
      features: [
        "Three-tier Role Based Access Control",
        "Optimized database queries with prefetching",
        "Scalable architecture for high-volume data",
        "Isolated candidate and recruiter workflows",
        "Comprehensive job board management"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/CareerHub"
    },
    "6": {
      idx: "06",
      title: "CryptGuard",
      subtitle: "E2E Encrypted Messaging",
      desc: "3-layer proprietary encryption: Character Mapping → Bitwise XOR → Channel-Isolation. Keys auto-purged on closure.",
      stack: ["Django", "XOR", "E2EE"],
      features: [
        "End-to-end encryption protocols",
        "Custom 3-layer bitwise XOR algorithm",
        "Secure key management and auto-purging",
        "Real-time message isolation",
        "Robust backend with Django security patterns"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/CryptGuard"
    },
    "7": {
      idx: "08",
      title: "CampusNexus",
      subtitle: "Campus ERP",
      desc: "Comprehensive educational resource planning system for campus management, student tracking, and resource allocation.",
      stack: ["Python", "Django", "Bootstrap", "SQLite"],
      features: [
        "Automated student attendance and grading systems",
        "Faculty workload management and scheduling",
        "Financial tracking and fee management modules",
        "Secure student and parent portals",
        "Exportable analytics and reports"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/CampusNexus"
    },
    "8": {
      idx: "05",
      title: "AI-Agent",
      subtitle: "Agentic Researcher",
      desc: "Fully local private AI agent. LangGraph + Ollama routes between Wikipedia and live web search — zero API costs.",
      stack: ["LangGraph", "Ollama", "Llama 3.1"],
      features: [
        "Autonomous query decomposition and research planning",
        "Tool-calling for Wikipedia and Web Search integration",
        "Persistent state graph for conversational memory",
        "Local inference with Llama 3.1 for total privacy",
        "Cost-effective research automation with no per-token fees"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/AI-Agent"
    },
    "9": {
      idx: "09",
      title: "CamVision",
      subtitle: "ROI Object Tracking",
      desc: "Real-time object tracking system with region-of-interest gating for optimized video processing.",
      stack: ["OpenCV", "YOLOv8", "CUDA"],
      features: [
        "Custom ROI definition for targeted surveillance",
        "YOLOv8-based object detection and classification",
        "Multi-object tracking with ID persistence",
        "Optimized CUDA-accelerated inference",
        "Automated alert triggers on ROI entry/exit"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/CamVision"
    },
    "10": {
      idx: "10",
      title: "AeroPiano",
      subtitle: "Hand Gesture Piano",
      desc: "Interactive virtual piano controlled by real-time hand gesture recognition and skeletal tracking.",
      stack: ["MediaPipe", "Python", "PyGame"],
      features: [
        "21-point hand landmark tracking via MediaPipe",
        "Gesture-to-MIDI mapping for real-time play",
        "Visual feedback system built with PyGame",
        "Low-latency audio synthesis",
        "Supports multiple simultaneous note triggers"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/AeroPiano"
    },
    "11": {
      idx: "11",
      title: "PalmID",
      subtitle: "Biometric Palm Auth",
      desc: "Secure biometric authentication system based on palm-vein and texture analysis using computer vision.",
      stack: ["Computer Vision", "Python", "PyTorch"],
      features: [
        "Infrared palm-vein pattern extraction",
        "Deep learning based texture matching",
        "Liveness detection to prevent spoofing",
        "Encrypted biometric template storage",
        "High-accuracy identification (99%+) in controlled lighting"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/PalmID"
    },
    "12": {
      idx: "04",
      title: "Vision Forge",
      subtitle: "Model Training Studio",
      desc: "Train custom YOLOv8 models from Roboflow datasets through a professional web interface.",
      stack: ["Python", "Streamlit", "YOLOv8", "Roboflow API"],
      features: [
        "Live epoch log streaming via Server-Sent Events",
        "Automated hyperparameter tuning options",
        "Model performance visualization and metrics",
        "One-click export to ONNX, TensorRT, and OpenVINO",
        "Integrated cloud training support for Colab/T4"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/VisionForge"
    },
    "13": {
      idx: "13",
      title: "MediScan",
      subtitle: "AI Health Analysis",
      desc: "AI-powered medical report analysis and diagnostic assistance tool using LLMs for report summarization.",
      stack: ["Gen AI", "FastAPI", "Python", "Llama Index"],
      features: [
        "Automated medical terminology extraction",
        "Context-aware report summarization",
        "Risk factor identification and highlighting",
        "Secure, encrypted document handling",
        "Interactive Q&A for medical reports"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/MediScan"
    },
    "14": {
      idx: "14",
      title: "MatSetu",
      subtitle: "AI Content Mesh",
      desc: "Advanced AI-driven educational resource aggregator and personalized learning path generator.",
      stack: ["Next.js", "FastAPI", "PostgreSQL", "OpenAI"],
      features: [
        "Multi-source resource aggregation (YouTube, Coursera, MIT)",
        "Personalized learning path generation based on goals",
        "Interactive progress tracking and skill mapping",
        "Collaborative study groups and resource sharing",
        "Vector-search enabled knowledge discovery"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/MatSetu"
    },
    "15": {
      idx: "12",
      title: "InsightHub",
      subtitle: "Content Management System",
      desc: "A robust Django-based CMS for dynamic content creation, featuring a strict lifecycle (Draft to Archive), comment moderation, and advanced search.",
      stack: ["Python", "Django", "PostgreSQL", "Bootstrap 5", "Pillow"],
      features: [
        "Full Content Lifecycle: Managed stages from Draft/Review to Public/Archive",
        "Rich Text Editor & Media Management: Format posts and handle cover images",
        "Advanced Search Engine: Filter articles by keyword, author, or category",
        "Interaction System: Threaded comments with author/admin moderation tools",
        "Role-Based Access Control: Specialized workflows for authors and readers",
        "Security-First Design: Built-in XSS protection and CSRF security tokens"
      ],
      live: "#",
      github: "https://github.com/arpitpatel1364/blog-system"
    }
  };

  const modal = document.getElementById("projectModal");
  const closeBtn = document.getElementById("modalClose");

  if (!modal || !closeBtn) return;

  // Expose to window for reliability and debugging
  window.openModal = function (id) {
    const data = projectsData[id];
    if (!data) return;

    document.getElementById("modalIdx").textContent = data.idx || "00";
    document.getElementById("modalTitle").textContent = data.title || "";
    document.getElementById("modalSubtitle").textContent = data.subtitle || "";
    document.getElementById("modalDesc").textContent = data.desc || "";

    const featList = document.getElementById("modalFeatures");
    if (featList) {
      featList.innerHTML = (data.features || []).map(f => `<li>${f}</li>`).join("");
    }

    const stackWrap = document.getElementById("modalStack");
    if (stackWrap) {
      stackWrap.innerHTML = (data.stack || []).map(s => `<span class="chip">${s}</span>`).join("");
    }

    const liveLink = document.getElementById("modalLive");
    const gitLink = document.getElementById("modalGit");

    if (liveLink) {
      if (!data.live || data.live === "#") {
        liveLink.style.display = "none";
      } else {
        liveLink.style.display = "inline-flex";
        liveLink.href = data.live;
      }
    }
    if (gitLink) {
      gitLink.href = data.github || "#";
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  window.closeModal = function () {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  };

  // Event Delegation: More robust than individual listeners
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".proj-card");
    if (card) {
      const id = card.getAttribute("data-id");
      if (id) window.openModal(id);
    }
  });

  closeBtn.addEventListener("click", window.closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) window.closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      window.closeModal();
    }
  });

})();
/* ============================================================
   ENHANCED ANIMATIONS & BUG FIXES v3
   ============================================================ */
(function () {
  "use strict";

  /* ── 1) Ripple effect on buttons ── */
  document.querySelectorAll(".btn-prim, .btn-ghost").forEach(btn => {
    btn.addEventListener("click", function (e) {
      const r = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(r.width, r.height) * 2;
      ripple.className = "btn-ripple";
      Object.assign(ripple.style, {
        width: size + "px",
        height: size + "px",
        left: (e.clientX - r.left - size / 2) + "px",
        top: (e.clientY - r.top - size / 2) + "px",
      });
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ── 2) Preloader: add text label ── */
  const preloader = document.getElementById("preloader");
  if (preloader) {
    const txt = document.createElement("div");
    txt.className = "loader-text";
    txt.textContent = "Loading...";
    preloader.appendChild(txt);
  }

  /* ── 3) Nav logo data-text attribute ── */
  const navLogo = document.querySelector(".nav-logo");
  if (navLogo) navLogo.setAttribute("data-text", navLogo.textContent);

  /* ── 4) Footer typing cursor ── */
  const footerCopy = document.querySelector(".footer-copy");
  if (footerCopy) {
    const cursor = document.createElement("span");
    cursor.className = "footer-cursor";
    footerCopy.appendChild(cursor);
  }

  /* ── 5) Add floating particles to hero ── */
  const hero = document.getElementById("hero");
  if (hero) {
    for (let i = 1; i <= 5; i++) {
      const p = document.createElement("div");
      p.className = `hero-particle p${i}`;
      hero.appendChild(p);
    }
  }

  /* ── 6) Smooth counter animation for stats ── */
  function animateCounter(el, target, duration) {
    const start = performance.now();
    const isSemver = String(target).includes(".");
    const startVal = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (target - startVal) * eased;

      if (isSemver) {
        el.textContent = current.toFixed(2);
      } else {
        el.textContent = Math.floor(current);
      }

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isSemver ? target.toFixed(2) : target;
    }
    requestAnimationFrame(update);
  }

  /* Observe stat numbers and animate them in ── */
  const statNums = document.querySelectorAll(".stat-num, .h-stat-n");
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const sup = el.querySelector("sup");
      const rawText = el.childNodes[0]?.nodeValue?.trim() || "";
      const num = parseFloat(rawText);
      if (!isNaN(num) && !el.dataset.animated) {
        el.dataset.animated = "true";
        const supEl = sup ? sup.outerHTML : "";
        el.innerHTML = supEl;
        const span = document.createElement("span");
        span.className = "count-num";
        el.prepend(span);
        if (sup) el.appendChild(sup.cloneNode(true));
        animateCounter(span, num, 1400);
      }
      counterObs.unobserve(el);
    });
  }, { threshold: .5 });

  statNums.forEach(el => counterObs.observe(el));

  /* ── 7) Parallax on hero photo ── */
  const heroPhoto = document.getElementById("heroPhoto");
  if (heroPhoto && !matchMedia("(hover: none)").matches) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight * 1.5) {
        heroPhoto.style.transform = `translateY(${scrolled * 0.18}px)`;
      }
    }, { passive: true });
  }

  /* ── 8) Magnetic buttons on hero ── */
  if (!matchMedia("(hover: none)").matches) {
    document.querySelectorAll(".btn-prim, .btn-ghost, .nav-cta").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
        btn.style.transition = "transform .4s var(--ease-out-soft)";
        setTimeout(() => { btn.style.transition = ""; }, 400);
      });
    });
  }

  /* ── 9) Intersection observer for s-label special entrance ── */
  const labelObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        labelObs.unobserve(e.target);
      }
    });
  }, { threshold: .3 });
  document.querySelectorAll(".s-label").forEach(el => labelObs.observe(el));

  /* ── 10) Smooth skill card grid: add stagger on enter ── */
  const skCards = document.querySelectorAll(".sk-card");
  const skObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = [...skCards].indexOf(entry.target);
        entry.target.style.transitionDelay = (idx % 3 * 0.07) + "s";
        entry.target.classList.add("in");
        skObs.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  skCards.forEach(c => { c.classList.add("reveal"); skObs.observe(c); });

  /* ── 11) Fix: Modal open/close animation ── */
  const modalOverlay = document.getElementById("projectModal");
  if (modalOverlay) {
    // Ensure modal is accessible by keyboard
    const focusableEls = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const originalOpen = window.openModal;
  }

  /* ── 12) Keyboard shortcut hint toast ── */
  let hintShown = false;
  window.addEventListener("scroll", () => {
    if (!hintShown && window.scrollY > 300) {
      hintShown = true;
      const hint = document.createElement("div");
      hint.textContent = "Press ⌘K or Ctrl+K for quick navigation";
      Object.assign(hint.style, {
        position: "fixed", bottom: "80px", right: "22px",
        background: "var(--bg2)", color: "var(--text3)",
        border: "1px solid var(--border)", padding: "8px 14px",
        borderRadius: "6px", fontFamily: "DM Mono, monospace",
        fontSize: "10px", letterSpacing: ".05em", zIndex: 599,
        opacity: "0", transition: "opacity .4s", pointerEvents: "none",
        maxWidth: "200px", lineHeight: "1.5"
      });
      document.body.appendChild(hint);
      setTimeout(() => { hint.style.opacity = "1"; }, 50);
      setTimeout(() => {
        hint.style.opacity = "0";
        setTimeout(() => hint.remove(), 400);
      }, 4000);
    }
  }, { passive: true });

  /* ── 13) Infra cards staggered entrance ── */
  const infraCards = document.querySelectorAll(".infra-card");
  const infraObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = [...infraCards].indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add("in");
        }, idx * 80);
        infraObs.unobserve(entry.target);
      }
    });
  }, { threshold: .06 });
  infraCards.forEach(c => { c.classList.add("reveal"); infraObs.observe(c); });

  /* ── 14) Smooth page reveal on load ── */
  document.documentElement.style.opacity = "0";
  document.documentElement.style.transition = "opacity .4s";
  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      document.documentElement.style.opacity = "1";
    });
  });

  /* ── 15) Scroll performance: use passive listeners ── */
  // Already handled above. Verify sbar listener uses passive.

  /* ── 16) Project cards: enhance click feedback ── */
  document.querySelectorAll(".proj-card").forEach(card => {
    card.addEventListener("mousedown", function () {
      this.style.transform = "translateY(-1px) scale(.995)";
    });
    card.addEventListener("mouseup", function () {
      this.style.transform = "";
    });
    card.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });

  /* ── 17) Active section highlight in mobile menu too ── */
  const mobLinks = document.querySelectorAll("#mob-menu a");
  const sectionIds = ["about", "skills", "sysdesign", "infrastructure", "projects", "activity", "education"];
  const mobObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        mobLinks.forEach(link => {
          link.style.color = link.getAttribute("href") === "#" + entry.target.id
            ? "var(--text)" : "";
        });
      }
    });
  }, { threshold: .3, rootMargin: "-30% 0px -30% 0px" });
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) mobObs.observe(el);
  });

  /* ── 18) Performance: requestIdleCallback for non-critical init ── */
  const idle = window.requestIdleCallback || (cb => setTimeout(cb, 1));
  idle(() => {
    // Pre-connect hints
    const link = document.createElement("link");
    link.rel = "dns-prefetch";
    link.href = "//fonts.googleapis.com";
    document.head.appendChild(link);
  });

})();
