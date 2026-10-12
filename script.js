/**
 * Arshad A - Portfolio Script
 * Interactive features: Typing rotator, terminal emulator, theme switcher,
 * category filter, copy-to-clipboard toast, modal manager, and print triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingRole();
  initTerminal();
  initSkillsFilter();
  initModals();
  initCopyButtons();
  initContactForm();
  initMobileMenu();
  initProjectModals();
  initCurrentYear();
});

/* --------------------------------------------------------------------------
   1. Theme Switcher (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('arshad_theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('arshad_theme', newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });
}

/* --------------------------------------------------------------------------
   2. Dynamic Role Typing Rotator
   -------------------------------------------------------------------------- */
function initTypingRole() {
  const roleEl = document.getElementById('dynamicRole');
  if (!roleEl) return;

  const roles = [
    'Embedded Systems Engineer',
    'Firmware & Low-Level Dev',
    'Java Developer',
    'Problem Solver (200+ LeetCode)',
    'Electronics & Comm. Undergrad'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const holdDelay = 1800;

  function typeTick() {
    const currentRole = roles[roleIdx];

    if (!isDeleting) {
      charIdx++;
      roleEl.textContent = currentRole.substring(0, charIdx);

      if (charIdx === currentRole.length) {
        isDeleting = true;
        setTimeout(typeTick, holdDelay);
        return;
      }
    } else {
      charIdx--;
      roleEl.textContent = currentRole.substring(0, charIdx);

      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }

    setTimeout(typeTick, isDeleting ? deleteSpeed : typeSpeed);
  }

  typeTick();
}

/* --------------------------------------------------------------------------
   3. Interactive Terminal Emulator
   -------------------------------------------------------------------------- */
function initTerminal() {
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');
  if (!input || !output) return;

  const history = [];
  let historyIdx = -1;

  const commands = {
    help: () => `Available commands:
  • <span class="t-cmd">whoami</span>       : Display bio summary
  • <span class="t-cmd">skills</span>       : List core tech stack
  • <span class="t-cmd">projects</span>     : Highlight top engineering projects
  • <span class="t-cmd">leetcode</span>     : LeetCode stats & rating
  • <span class="t-cmd">experience</span>   : Internship & background
  • <span class="t-cmd">education</span>    : Degree & college details
  • <span class="t-cmd">contact</span>      : Show email & phone info
  • <span class="t-cmd">linkedin</span>     : Open LinkedIn profile
  • <span class="t-cmd">clear</span>        : Clear terminal output`,

    whoami: () => `Arshad A &bull; B.E Electronics & Communication Engineering (2024-2028).
Aspiring Embedded Systems, Firmware & Software Engineer with strong DSA & Java background.`,

    skills: () => `Languages : C, C++, Java, Python
Embedded  : Microcontrollers, Embedded Linux, State Machines, UART/GPIO
Web       : HTML5, CSS3, JavaScript
Platforms : Git, GitHub, VS Code, LeetCode (200+), GeeksforGeeks`,

    projects: () => `1. Medical History Record System (Java, OOP, Collections, File I/O)
2. TV Shows & Movies Web Portal (Responsive HTML5, CSS3, UI/UX)
3. Embedded Device Controller (C, Microcontroller simulation, FSM)
4. Algorithmic Problem Solving Suite (200+ LeetCode, Contest Rating 1473)`,

    leetcode: () => `<span class="t-success">LeetCode Solved:</span> 200+ Problems
<span class="t-success">Contest Rating:</span> 1473
<span class="t-success">Top Patterns:</span> Arrays, Two Pointers, Sliding Window, Trees, Binary Search.`,

    experience: () => `Alfido Tech (2026) — Java Developer Intern
• Built modular OOP components, managed data structures, and practiced Git workflows.
• Certified upon successful project delivery.`,

    education: () => `B.E in Electronics and Communication Engineering
Karpagam College of Engineering, Coimbatore, India
Expected Apr 2028 &bull; CGPA: 8.1 / 10.00`,

    contact: () => `Email    : arshadarshad0632c@gmail.com
Phone    : +91 8098178665
Location : Dharmapuri, Tamil Nadu, India
LinkedIn : linkedin.com/in/arshad0632`,

    linkedin: () => {
      window.open('https://linkedin.com/in/arshad0632', '_blank');
      return 'Redirecting to linkedin.com/in/arshad0632...';
    },

    clear: () => {
      output.innerHTML = `
        <div class="terminal-line"><span class="t-prompt">$</span> <span class="t-cmd">status --target</span></div>
        <div class="terminal-response t-success">✓ Ready for internship & entry-level engineering roles</div>
        <div class="terminal-line interactive-line">
          <span class="t-prompt">$</span>
          <input type="text" id="terminalInput" class="terminal-input" placeholder="Type 'help', 'skills', 'projects', 'contact'..." autocomplete="off">
        </div>
      `;
      // re-bind
      initTerminal();
      return null;
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = input.value.trim();
      if (!rawCmd) return;

      history.push(rawCmd);
      historyIdx = history.length;

      const cmd = rawCmd.toLowerCase();
      const parentLine = input.closest('.interactive-line');

      // Create static representation of what was entered
      const userEcho = document.createElement('div');
      userEcho.className = 'terminal-line';
      userEcho.innerHTML = `<span class="t-prompt">$</span> <span class="t-cmd">${escapeHtml(rawCmd)}</span>`;

      output.insertBefore(userEcho, parentLine);

      let responseHtml = '';
      if (commands[cmd]) {
        responseHtml = commands[cmd]();
      } else {
        responseHtml = `<span style="color: #f87171;">Command not found: "${escapeHtml(rawCmd)}". Type 'help' for options.</span>`;
      }

      if (responseHtml !== null) {
        const respDiv = document.createElement('div');
        respDiv.className = 'terminal-response';
        respDiv.innerHTML = responseHtml;
        output.insertBefore(respDiv, parentLine);
      }

      input.value = '';
      output.scrollTop = output.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        input.value = history[historyIdx];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        input.value = '';
      }
      e.preventDefault();
    }
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

/* --------------------------------------------------------------------------
   4. Skills Matrix Category Filter
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.skill-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Modals Management (Resume & LinkedIn Pack)
   -------------------------------------------------------------------------- */
function initModals() {
  const resumeModal = document.getElementById('resumeModal');
  const linkedInModal = document.getElementById('linkedInModal');

  const openResumeBtn = document.getElementById('openResumeBtn');
  const openLinkedInGuideBtn = document.getElementById('openLinkedInGuideBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  // Open Resume Modal
  if (openResumeBtn && resumeModal) {
    openResumeBtn.addEventListener('click', () => {
      openModal(resumeModal);
    });
  }

  // Open LinkedIn Modal
  if (openLinkedInGuideBtn && linkedInModal) {
    openLinkedInGuideBtn.addEventListener('click', () => {
      openModal(linkedInModal);
    });
  }

  // Print Resume
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Close buttons with data-close
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close');
      const modal = document.getElementById(targetId);
      if (modal) closeModal(modal);
    });
  });

  // Close on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
        closeModal(modal);
      });
    }
  });
}

function openModal(modal) {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   6. Copy-to-Clipboard & Toast Feedback
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  // Standard icon copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        copyToClipboard(textToCopy, 'Copied to clipboard!');
      }
    });
  });

  // Large LinkedIn pack copy buttons
  document.querySelectorAll('.copy-btn-lg').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        copyToClipboard(targetEl.textContent.trim(), 'LinkedIn content copied to clipboard!');
      }
    });
  });
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast(successMsg);
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* --------------------------------------------------------------------------
   7. Contact Form Handler (Direct Mailto Composer)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const subject = document.getElementById('messageSubject').value.trim();
    const message = document.getElementById('messageBody').value.trim();

    const fullSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
    const fullBody = encodeURIComponent(
`Hi Arshad,

${message}

---
Sender Details:
Name: ${name}
Email: ${email}
Sent via Arshad Portfolio Contact Form`
    );

    const mailtoUrl = `mailto:arshadarshad0632c@gmail.com?subject=${fullSubject}&body=${fullBody}`;

    if (feedback) {
      feedback.className = 'form-feedback success';
      feedback.textContent = 'Launching email draft with pre-filled details...';
    }

    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 400);
  });
}

/* --------------------------------------------------------------------------
   8. Mobile Navigation Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  if (!menuBtn || !navMenu) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    const icon = menuBtn.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    }
  });

  // Close menu when clicking any nav link
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      const icon = menuBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    });
  });
}

/* --------------------------------------------------------------------------
   9. Interactive Project Details Modals / Alerts
   -------------------------------------------------------------------------- */
function initProjectModals() {
  const detailButtons = document.querySelectorAll('.project-details-btn');
  const certButtons = document.querySelectorAll('.view-cert-btn');

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      if (projectKey === 'medical') {
        showCustomAlert(
          'Medical History Record System - Architecture',
          `• Architecture: Model-View-Controller (MVC) pattern in Java.
• Core Classes: Patient, MedicalRecord, DoctorVisit, Prescription, ClinicalManager.
• Data Structures: ArrayList & HashMap for O(1) patient ID lookups and chronological record sorting.
• Persistence: File I/O serialization with structured error recovery and input sanitization.`
        );
      } else if (projectKey === 'movies') {
        showCustomAlert(
          'TV Shows & Movies Portal - Frontend Highlights',
          `• Layout: 100% Responsive CSS Grid & Flexbox with zero layout shifts (CLS < 0.05).
• Categorization: Dynamic filtering for Trending, Action, Drama, Sci-Fi.
• Aesthetics: Cinema Dark theme with backdrop-filter glassmorphism, responsive posters, and accessible focus states.`
        );
      } else if (projectKey === 'embedded') {
        showCustomAlert(
          'Embedded Device Controller - Systems Deep Dive',
          `• Architecture: Non-blocking Finite State Machine (FSM) implemented in ANSI C.
• Communication: Simulated UART packet protocol with start/stop framing and CRC checksum verification.
• Platform: Designed for Microcontrollers (ARM Cortex-M / AVR) & Embedded Linux user-space device testing.`
        );
      }
    });
  });

  certButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const certKey = btn.getAttribute('data-cert');
      if (certKey === 'alfido') {
        showCustomAlert(
          'Alfido Tech - Java Developer Internship',
          `• Recipient: Arshad A
• Issued By: Alfido Tech (2026)
• Scope: Core Java, Object-Oriented Software Design, Collections Framework, Version Control with Git/GitHub.`
        );
      } else if (certKey === 'google-ai') {
        showCustomAlert(
          'Google AI Essentials - Certification',
          `• Issued By: Google
• Key Competencies: Generative AI tools, modern productivity workflows, responsible & ethical AI practices, data automation.`
        );
      } else if (certKey === 'google-prompting') {
        showCustomAlert(
          'Google Prompting Essentials - Certification',
          `• Issued By: Google
• Key Competencies: Advanced prompt design, multi-turn reasoning, data structuring, task decomposition, complex analytical problem solving.`
        );
      }
    });
  });
}

function showCustomAlert(title, message) {
  alert(`${title}\n\n${message}`);
}

/* --------------------------------------------------------------------------
   10. Current Year Auto-Update
   -------------------------------------------------------------------------- */
function initCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
