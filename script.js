// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

// Theme Toggle: initialize and wire up
const themeToggle = document.getElementById("themeToggle");

/** Initialize theme on load:
 *  Priority: localStorage -> light (do NOT auto-follow system to avoid unexpected dark theme)
 */
(function initTheme() {
  const stored = localStorage.getItem("color-scheme");
  // Default to light when there's no explicit user choice
  const scheme = stored ? stored : "light";
  document.documentElement.setAttribute("data-color-scheme", scheme);
  updateThemeIcon(scheme);
})();

function updateThemeIcon(scheme) {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector("i");
  if (!icon) return;
  if (scheme === "dark") {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-color-scheme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-color-scheme", next);
    localStorage.setItem("color-scheme", next);
    updateThemeIcon(next);
  });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      const spans = menuToggle.querySelectorAll("span");
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  });
});

// Navbar Scroll Effect
const navbar = document.getElementById("navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

// Active Navigation Link
const currentLocation =
  window.location.pathname.split("/").pop() || "index.html";
navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentLocation) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Contact Form Submission
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Validate form
    if (!name || !email || !subject || !message) {
      showFormMessage("Please fill in all required fields.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage("Please enter a valid email address.", "error");
      return;
    }

    const emailBody = `
Hi Aman,

You have received a new message from your portfolio contact form.

Sender Name: ${name}
Sender Email: ${email}

Message:
${message}

—
This message was submitted from your portfolio website.
`;

    // In a real application, you would send this data to a server
    // For now, we'll just show a success message and create a mailto link

    const mailtoLink = `mailto:prajapatiaman445@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;

    showFormMessage(
      "Thank you for your message! Your email client should open shortly. If not, please email directly at prajapatiaman445@gmail.com",
      "success"
    );

    // Reset form
    contactForm.reset();
  });
}

function showFormMessage(message, type) {
  if (formMessage) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;

    // Auto-hide success message after 5 seconds
    if (type === "success") {
      setTimeout(() => {
        formMessage.style.display = "none";
      }, 5000);
    }
  }
}

// Animate on Scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Apply animation to cards and sections
const animateElements = document.querySelectorAll(
  ".skill-card, .project-card, .experience-card, .education-card, .achievement-card, .highlight-card"
);
animateElements.forEach((element) => {
  element.style.opacity = "0";
  element.style.transform = "translateY(30px)";
  element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(element);
});

// Counter Animation for Stats
const statNumbers = document.querySelectorAll(
  ".stat-number, .achievement-card h3"
);

const animateCounter = (element) => {
  const target = element.textContent;
  const isPercentage = target.includes("%");
  const isPlusSign = target.includes("+");
  const number = parseInt(target.replace(/[^\d]/g, ""));

  if (isNaN(number)) return;

  const duration = 2000;
  const steps = 60;
  const increment = number / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= number) {
      current = number;
      clearInterval(timer);
    }

    let displayValue = Math.floor(current).toString();
    if (isPlusSign) displayValue += "+";
    if (isPercentage) displayValue += "%";

    element.textContent = displayValue;
  }, duration / steps);
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach((stat) => {
  statsObserver.observe(stat);
});

// Add loading animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});

// Typing Effect for Hero Title (Optional Enhancement)
const heroTitle = document.querySelector(".hero-title");
if (heroTitle) {
  const text = heroTitle.textContent;
  heroTitle.textContent = "";
  let i = 0;

  const typeWriter = () => {
    if (i < text.length) {
      heroTitle.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  };

  // Uncomment to enable typing effect
  // setTimeout(typeWriter, 500);
}

// Print Resume Function (can be added to a button)
function printResume() {
  window.print();
}

// Download Resume Function (can be added to a button)
function downloadResume() {
  // In a real application, this would link to an actual PDF file
  alert(
    "Resume download functionality would be implemented here with a real PDF file."
  );
}

// Add scroll-to-top button
const scrollTopBtn = document.createElement("button");
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = "scroll-top-btn";
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-color, #2563eb);
    color: white;
    border: none;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollTopBtn.style.opacity = "1";
  } else {
    scrollTopBtn.style.opacity = "0";
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

scrollTopBtn.addEventListener("mouseenter", () => {
  scrollTopBtn.style.transform = "translateY(-5px)";
});

scrollTopBtn.addEventListener("mouseleave", () => {
  scrollTopBtn.style.transform = "translateY(0)";
});

// Console Easter Egg
console.log(
  "%cHey there! 👋",
  "color: #2563eb; font-size: 24px; font-weight: bold;"
);
console.log(
  "%cLooking for a talented developer? Let's connect!",
  "color: #10b981; font-size: 16px;"
);
console.log(
  "%cEmail: prajapatiaman445@gmail.com",
  "color: #64748b; font-size: 14px;"
);
console.log(
  "%cLinkedIn: https://www.linkedin.com/in/ak9773",
  "color: #64748b; font-size: 14px;"
);
