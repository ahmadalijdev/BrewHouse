const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar-links a');
const sections = document.querySelectorAll('#home, #about, #menu, #gallery, #contact');
const revealElements = document.querySelectorAll('.reveal, .hero-reveal');
const galleryImages = document.querySelectorAll('.gallery-grid img');

let lastScrollY = window.scrollY;
let ticking = false;

function handleScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    navbar.classList.add('hide');
  } else if (currentScrollY < lastScrollY) {
    navbar.classList.remove('hide');
  }

  lastScrollY = currentScrollY;
  updateActiveNav();
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.12
});

revealElements.forEach((element) => revealObserver.observe(element));

function updateActiveNav() {
  const scrollPosition = window.scrollY + window.innerHeight * 0.35;
  let currentSection = sections[0];

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSection = section;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${currentSection.id}`
    );
  });
}

window.addEventListener('load', updateActiveNav);
window.addEventListener('resize', updateActiveNav);

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  galleryImages.forEach((image) => {
    image.addEventListener('mousemove', (event) => {
      const rect = image.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      image.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    });

    image.addEventListener('mouseleave', () => {
      image.style.transform = '';
    });
  });
}

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightboxImage');
const lightboxClose = document.querySelector('#lightboxClose');
const lightboxPrev = document.querySelector('#lightboxPrev');
const lightboxNext = document.querySelector('#lightboxNext');
const lightboxImages = [...galleryImages];

let currentImageIndex = 0;

function updateLightboxImage() {
  const image = lightboxImages[currentImageIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
}

function openLightbox(index) {
  currentImageIndex = index;
  updateLightboxImage();
  lightbox.classList.add('show');
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  lightbox.classList.remove('show');
  document.body.classList.remove('lightbox-open');
}

function showPreviousImage() {
  currentImageIndex = (currentImageIndex - 1 + lightboxImages.length) % lightboxImages.length;
  updateLightboxImage();
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % lightboxImages.length;
  updateLightboxImage();
}

lightboxImages.forEach((image, index) => {
  image.addEventListener('click', () => openLightbox(index));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPreviousImage);
lightboxNext.addEventListener('click', showNextImage);

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('show')) {
    return;
  }

  if (event.key === 'Escape') {
    closeLightbox();
  } else if (event.key === 'ArrowLeft') {
    showPreviousImage();
  } else if (event.key === 'ArrowRight') {
    showNextImage();
  }
});