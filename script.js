// script.js - Transições fluidas e efeitos medievais
document.addEventListener('DOMContentLoaded', () => {
  const slidesContainer = document.getElementById('slides');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('dots');
  const progressBar = document.getElementById('progressBar');
  const TRANS_MS = 1000; // Transição mais longa para efeito mais fluido

  let current = 0;
  let isAnimating = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;
  const THRESHOLD = 40;

  // Build dots navigation
  const slides = Array.from(document.querySelectorAll('.slide'));
  slides.forEach((s, i) => {
    const d = document.createElement('button');
    d.className = 'dot';
    d.dataset.index = i;
    d.setAttribute('aria-label', `Ir para slide ${i+1}`);
    if (i === 0) d.classList.add('active');
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(document.querySelectorAll('.dot'));

  // Initialize slides
  slides.forEach((s, i) => {
    if (i === 0) {
      s.classList.add('active');
      s.style.transform = 'translateX(0)';
      s.style.opacity = '1';
      s.setAttribute('aria-hidden', 'false');
    } else {
      s.style.transform = 'translateX(100%)';
      s.style.opacity = '0';
    }
    
    // Add medieval decorative elements to each slide
    addMedievalDecorations(s);
  });

  // Add medieval decorative elements
  function addMedievalDecorations(slide) {
    // Skip title slide
    if (slide.classList.contains('slide--title')) return;
    
    // Add border
    const border = document.createElement('div');
    border.className = 'medieval-border';
    slide.appendChild(border);
    
    // Add floating elements
    const shield = document.createElement('div');
    shield.className = 'floating-shield';
    slide.appendChild(shield);
    
    const sword = document.createElement('div');
    sword.className = 'floating-sword';
    slide.appendChild(sword);
  }

  // Animate slide content when it becomes active
  function animateSlideContent(slide) {
    // Reset animations
    const textElements = slide.querySelectorAll('.text > *');
    const imageElements = slide.querySelectorAll('.slide-image-container');
    const cards = slide.querySelectorAll('.info-card, .importance-card');
    const notes = slide.querySelectorAll('.note-box');
    const features = slide.querySelectorAll('.feature-item');
    const timelineItems = slide.querySelectorAll('.timeline-item');
    const keyPoints = slide.querySelectorAll('.key-point');
    
    // Remove any existing animations
    [...textElements, ...imageElements, ...cards, ...notes, ...features, ...timelineItems, ...keyPoints].forEach(el => {
      el.style.animation = 'none';
    });
    
    // Trigger reflow
    void slide.offsetWidth;
    
    // Apply staggered animations
    textElements.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.8s ease-out ${i * 0.1}s both`;
    });
    
    imageElements.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.8s ease-out ${i * 0.15 + 0.2}s both`;
    });
    
    cards.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.7s ease-out ${i * 0.1 + 0.3}s both`;
    });
    
    notes.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.7s ease-out ${i * 0.1 + 0.35}s both`;
    });
    
    features.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.7s ease-out ${i * 0.1 + 0.4}s both`;
    });
    
    timelineItems.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.7s ease-out ${i * 0.1 + 0.45}s both`;
    });
    
    keyPoints.forEach((el, i) => {
      el.style.animation = `fadeInUp 0.7s ease-out ${i * 0.1 + 0.5}s both`;
    });
    
    // Add special animations to specific elements
    const icons = slide.querySelectorAll('.card-icon, .key-point i, .feature-item i');
    icons.forEach(icon => {
      icon.style.animation = 'pulse 2.5s infinite ease-in-out';
    });
    
    // Add bounce animation to final message
    const finalMessage = slide.querySelector('.final-message');
    if (finalMessage) {
      finalMessage.style.animation = 'bounce 3.5s infinite ease-in-out';
    }
  }

  // Update progress bar
  function updateProgress(idx) {
    const progress = ((idx + 1) / slides.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Update dots navigation
  function updateDots(idx) {
    dots.forEach(d => d.classList.toggle('active', Number(d.dataset.index) === idx));
  }

  // Navigate to specific slide with smooth transition
  function goTo(nextIdx) {
    if (isAnimating || nextIdx === current) return;
    if (nextIdx < 0) nextIdx = slides.length - 1;
    if (nextIdx >= slides.length) nextIdx = 0;
    
    isAnimating = true;
    
    // Update current and next slides
    const currentSlide = slides[current];
    const nextSlide = slides[nextIdx];
    
    // Set direction for animation
    const direction = nextIdx > current ? 1 : -1;
    
    // Prepare next slide
    nextSlide.style.transform = `translateX(${direction * 100}%)`;
    nextSlide.style.opacity = '0';
    nextSlide.classList.add('active');
    
    // Force reflow
    void nextSlide.offsetWidth;
    
    // Animate both slides simultaneously for smoother transition
    currentSlide.style.transform = `translateX(${-direction * 100}%)`;
    currentSlide.style.opacity = '0.5';
    
    nextSlide.style.transform = 'translateX(0)';
    nextSlide.style.opacity = '1';
    
    // Update accessibility attributes
    currentSlide.setAttribute('aria-hidden', 'true');
    nextSlide.setAttribute('aria-hidden', 'false');
    
    // Animate content in the new slide after a short delay
    setTimeout(() => {
      animateSlideContent(nextSlide);
      
      // Update current index and UI
      current = nextIdx;
      updateDots(current);
      updateProgress(current);
      
      // Add floating animation to elements
      const floatingElements = nextSlide.querySelectorAll('.info-card, .note-box, .importance-card, .feature-item');
      floatingElements.forEach(el => {
        el.classList.add('floating');
      });
    }, TRANS_MS / 2);
    
    // Finish transition
    setTimeout(() => {
      currentSlide.classList.remove('active');
      isAnimating = false;
    }, TRANS_MS);
  }

  // Navigation controls
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach(d => d.addEventListener('click', (e) => goTo(Number(e.currentTarget.dataset.index))));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(current + 1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(current - 1);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    }
    if (e.key === 'End') {
      e.preventDefault();
      goTo(slides.length - 1);
    }
  });

  // Touch swipe support
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchMoved = false;
  }, {passive: true});

  document.addEventListener('touchmove', (e) => {
    if (!touchMoved && e.touches.length === 1) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      
      const diffX = touchX - touchStartX;
      const diffY = touchY - touchStartY;
      
      // Check if it's primarily a horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > THRESHOLD) {
        touchMoved = true;
        
        if (diffX < 0) {
          goTo(current + 1); // Swipe left - next
        } else {
          goTo(current - 1); // Swipe right - previous
        }
      }
    }
  }, {passive: true});

  document.addEventListener('touchend', (e) => {
    if (!touchMoved) return;
    touchMoved = false;
  }, {passive: true});

  // Initialize progress bar
  updateProgress(current);
  
  // Animate content in the first slide
  setTimeout(() => {
    animateSlideContent(slides[current]);
    
    // Add floating animation to elements
    const floatingElements = document.querySelectorAll('.info-card, .note-box, .importance-card, .feature-item');
    floatingElements.forEach(el => {
      el.classList.add('floating');
    });
  }, 500);
  
  // Auto-rotate slides (optional)
  let autoRotateInterval = setInterval(() => {
    if (!isAnimating && !touchMoved) {
      goTo(current + 1);
    }
  }, 10000);
  
  // Pause auto-rotation when user interacts
  const stopAutoRotate = () => {
    clearInterval(autoRotateInterval);
  };
  
  document.addEventListener('keydown', stopAutoRotate);
  document.addEventListener('click', stopAutoRotate);
  document.addEventListener('touchstart', stopAutoRotate);

  // Add CSS animations dynamically with better easing
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.05);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 0.8;
      }
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-15px);
      }
      60% {
        transform: translateY(-7px);
      }
    }
    
    /* Smooth transition for slides */
    .slide {
      transition: transform ${TRANS_MS}ms cubic-bezier(0.16, 1, 0.3, 1), 
                 opacity ${TRANS_MS}ms cubic-bezier(0.16, 1, 0.3, 1);
    }
  `;
  document.head.appendChild(style);
});