
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      const page = this.getAttribute("href");
      localStorage.setItem("currentPage", page);
    });
  });

  const nav = document.querySelector("nav");
  const toggleBtn = document.querySelector(".nav-toggle");
  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const list = document.getElementById('announcementsList');
  if (list) {
    const notes = JSON.parse(localStorage.getItem('announcements')) || [];
    list.innerHTML = notes.length ? notes.map(t => `<li>${t}</li>`).join('') : '<li>Chưa có thông báo</li>';
  }
});
