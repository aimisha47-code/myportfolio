/**
 * Portfolio JavaScript
 * Handles Navigation, Filtering, Lightbox, and Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close mobile menu when a nav link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // 2. Sticky Header styling on scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 3. Active Nav Link on Scroll (ScrollSpy)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Portfolio Filter System
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category?.includes(filterValue)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 5. Multi-Image Gallery Slider Lightbox
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxProjectTitle = document.getElementById('lightboxProjectTitle');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxThumbnails = document.getElementById('lightboxThumbnails');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxClose = document.getElementById('lightboxClose');

  let currentGallery = [];
  let currentIndex = 0;
  let currentProjectTitle = '';

  const updateSlide = (index) => {
    if (!currentGallery || currentGallery.length === 0) return;

    // Wrap around index
    if (index < 0) {
      currentIndex = currentGallery.length - 1;
    } else if (index >= currentGallery.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    const currentItem = currentGallery[currentIndex];

    // Smooth fade effect
    if (lightboxImg) {
      lightboxImg.style.opacity = '0';
      lightboxImg.style.transform = 'scale(0.97)';
      
      setTimeout(() => {
        lightboxImg.src = currentItem.src;
        lightboxImg.alt = currentItem.caption || currentProjectTitle || 'Project image';
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      }, 120);
    }

    if (lightboxCaption) {
      lightboxCaption.innerHTML = currentItem.caption || '';
    }

    if (lightboxProjectTitle) {
      lightboxProjectTitle.textContent = currentProjectTitle || '';
    }

    if (lightboxCounter) {
      if (currentGallery.length > 1) {
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
        lightboxCounter.style.display = 'block';
      } else {
        lightboxCounter.style.display = 'none';
      }
    }

    // Toggle navigation arrows if single image
    if (lightboxPrev && lightboxNext) {
      const showArrows = currentGallery.length > 1 ? 'flex' : 'none';
      lightboxPrev.style.display = showArrows;
      lightboxNext.style.display = showArrows;
    }

    // Update active thumbnail
    if (lightboxThumbnails) {
      const thumbs = lightboxThumbnails.querySelectorAll('.lightbox-thumb');
      thumbs.forEach((th, i) => {
        if (i === currentIndex) {
          th.classList.add('active');
          th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          th.classList.remove('active');
        }
      });
    }
  };

  const openGalleryModal = (items, startIndex = 0, title = '') => {
    if (!lightboxModal || !items || items.length === 0) return;

    currentGallery = items;
    currentIndex = startIndex;
    currentProjectTitle = title;

    // Build thumbnail strip
    if (lightboxThumbnails) {
      lightboxThumbnails.innerHTML = '';
      if (items.length > 1) {
        items.forEach((item, i) => {
          const thumb = document.createElement('img');
          thumb.src = item.src;
          thumb.alt = item.caption || `Thumbnail ${i + 1}`;
          thumb.className = `lightbox-thumb ${i === startIndex ? 'active' : ''}`;
          thumb.addEventListener('click', () => updateSlide(i));
          lightboxThumbnails.appendChild(thumb);
        });
        lightboxThumbnails.style.display = 'flex';
      } else {
        lightboxThumbnails.style.display = 'none';
      }
    }

    updateSlide(currentIndex);
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeGalleryModal = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Attach click listeners to all lightbox triggers
  document.querySelectorAll('.open-lightbox').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();

      const card = el.closest('.project-card') || el.closest('.about-image-wrap') || el.closest('.hero-image-wrap');
      const title = el.getAttribute('data-title') || card?.querySelector('.project-title')?.textContent || '';

      // Check if data-gallery attribute exists
      const galleryAttr = el.getAttribute('data-gallery') || card?.querySelector('[data-gallery]')?.getAttribute('data-gallery');

      if (galleryAttr) {
        try {
          const items = JSON.parse(galleryAttr);
          if (Array.isArray(items) && items.length > 0) {
            openGalleryModal(items, 0, title);
            return;
          }
        } catch (err) {
          console.warn('Error parsing data-gallery JSON:', err);
        }
      }

      // Fallback to single image from child img
      const img = card ? card.querySelector('img') : el.querySelector('img');
      if (img) {
        openGalleryModal([{ src: img.src, caption: title }], 0, title);
      }
    });
  });

  // Next and Previous Button Clicks
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSlide(currentIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSlide(currentIndex + 1);
    });
  }

  // Close Button
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeGalleryModal);
  }

  // Backdrop click to close
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-viewport')) {
        closeGalleryModal();
      }
    });
  }

  // Keyboard navigation: Left/Right arrows and Escape
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeGalleryModal();
    } else if (e.key === 'ArrowLeft') {
      updateSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateSlide(currentIndex + 1);
    }
  });

  // Mobile Touch Swipe Navigation
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          // Swipe Left -> Next
          updateSlide(currentIndex + 1);
        } else {
          // Swipe Right -> Prev
          updateSlide(currentIndex - 1);
        }
      }
    }, { passive: true });
  }

  // 6. Direct Email Copy to Clipboard
  const copyEmailBox = document.getElementById('copyEmailBox');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyFeedback = document.getElementById('copyFeedback');
  const copyIcon = document.getElementById('copyIcon');

  function handleCopyEmail(e) {
    if (e) e.preventDefault();
    const email = 'nuraimialisha70@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        if (copyFeedback) copyFeedback.textContent = 'Copied!';
        if (copyIcon) copyIcon.className = 'fas fa-check';
        if (copyEmailBox) copyEmailBox.classList.add('copied');
        setTimeout(() => {
          if (copyFeedback) copyFeedback.textContent = 'Copy';
          if (copyIcon) copyIcon.className = 'far fa-copy';
          if (copyEmailBox) copyEmailBox.classList.remove('copied');
        }, 2500);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    } else {
      // Fallback for older browsers
      window.location.href = `mailto:${email}`;
    }
  }

  if (copyEmailBox) {
    copyEmailBox.addEventListener('click', handleCopyEmail);
  }
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleCopyEmail(e);
    });
  }

  // 7. Skills Horizontal Scroll Buttons
  const skillWrapper = document.getElementById('skillScrollWrapper');
  const scrollLeftBtn = document.getElementById('scrollLeftBtn');
  const scrollRightBtn = document.getElementById('scrollRightBtn');

  if (skillWrapper && scrollLeftBtn && scrollRightBtn) {
    scrollLeftBtn.addEventListener('click', () => {
      skillWrapper.scrollBy({ left: -280, behavior: 'smooth' });
    });
    scrollRightBtn.addEventListener('click', () => {
      skillWrapper.scrollBy({ left: 280, behavior: 'smooth' });
    });
  }

  // 8. Auto-Moving Slideshow in About Me Section
  const aboutSlides = document.querySelectorAll('.auto-slide');
  const aboutDots = document.querySelectorAll('#aboutSlideDots .dot');
  const aboutPrev = document.getElementById('aboutSlidePrev');
  const aboutNext = document.getElementById('aboutSlideNext');
  const aboutContainer = document.getElementById('aboutAutoSlideshow');

  if (aboutSlides.length > 0) {
    let currentSlide = 0;
    let slideTimer = null;
    const autoIntervalTime = 3500; // Auto-moves every 3.5 seconds

    const renderSlide = (n) => {
      aboutSlides[currentSlide].classList.remove('active');
      if (aboutDots[currentSlide]) aboutDots[currentSlide].classList.remove('active');

      currentSlide = (n + aboutSlides.length) % aboutSlides.length;

      aboutSlides[currentSlide].classList.add('active');
      if (aboutDots[currentSlide]) aboutDots[currentSlide].classList.add('active');
    };

    const nextSlide = () => renderSlide(currentSlide + 1);
    const prevSlide = () => renderSlide(currentSlide - 1);

    const startAutoSlide = () => {
      if (!slideTimer) {
        slideTimer = setInterval(nextSlide, autoIntervalTime);
      }
    };

    const stopAutoSlide = () => {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    };

    if (aboutNext) {
      aboutNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
      });
    }

    if (aboutPrev) {
      aboutPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
      });
    }

    aboutDots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        renderSlide(idx);
        stopAutoSlide();
        startAutoSlide();
      });
    });

    // Pause on hover, resume on leave
    if (aboutContainer) {
      aboutContainer.addEventListener('mouseenter', stopAutoSlide);
      aboutContainer.addEventListener('mouseleave', startAutoSlide);

      // Touch swipe support for mobile
      let touchStartX = 0;
      let touchEndX = 0;

      aboutContainer.addEventListener('touchstart', (e) => {
        stopAutoSlide();
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      aboutContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) nextSlide();
          else prevSlide();
        }
        startAutoSlide();
      }, { passive: true });
    }

    // Start auto move
    startAutoSlide();
  }
});
