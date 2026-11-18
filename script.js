const menuButton = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = [...document.querySelectorAll(".nav-link")];

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  navMenu.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navMenu.classList.toggle("is-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sections = [...document.querySelectorAll("main section[id]")];
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.hash === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));
}

const grindBoard = document.querySelector(".grind-board");
let dragStartX = 0;
let dragScrollLeft = 0;
let isDragging = false;

grindBoard.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  dragStartX = event.clientX;
  dragScrollLeft = grindBoard.scrollLeft;
  isDragging = true;
  grindBoard.classList.add("is-dragging");
  grindBoard.setPointerCapture(event.pointerId);
});

grindBoard.addEventListener("pointermove", (event) => {
  if (!isDragging) return;
  grindBoard.scrollLeft = dragScrollLeft - (event.clientX - dragStartX);
});

function endDrag() {
  isDragging = false;
  grindBoard.classList.remove("is-dragging");
}

grindBoard.addEventListener("pointerup", endDrag);
grindBoard.addEventListener("pointercancel", endDrag);
grindBoard.addEventListener("lostpointercapture", endDrag);

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.classList.remove("error");

  if (!contactForm.reportValidity()) {
    formStatus.textContent = "Please check the fields above and try again.";
    formStatus.classList.add("error");
    return;
  }

  const formData = new FormData(contactForm);
  const subject = encodeURIComponent(formData.get("subject").trim());
  const message = encodeURIComponent(
    `From: ${formData.get("name").trim()} (${formData.get("email").trim()})\n\n${formData.get("message").trim()}`
  );
  formStatus.textContent = "Opening your email app to send this message…";
  window.location.href = `mailto:hello@example.com?subject=${subject}&body=${message}`;
});

document.querySelector("#year").textContent = new Date().getFullYear();
