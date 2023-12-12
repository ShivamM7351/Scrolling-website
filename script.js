'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

// Slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');


// Modal window
const openModal = function (e) {
    e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};


btnsOpenModal.
forEach( btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


 //IMPLEMENTING SMOOTH SCROLLING

btnScrollTo.addEventListener('click', function(e) {
// another modern way
section1.scrollIntoView({ behavior: 'smooth'});
});


// Page navigation

// Event Delegation: we need to step
// first: we add the event listener to common parent element
// 2. determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 
      'smooth'});
  }
})


// TABBED COMPONENT

tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');
  // Guard Clause
  if(!clicked) return;
  // Remove active classes
  tabs.forEach( t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach( c => c.classList.remove('operations__content--active'));
  // ACTIVE TAB
  clicked.classList.add('operations__tab--active');
  // ACTIVATE CONTENT AREA
  document.querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active');

})


// MENU FADE ANIMATION

const handleHover = function(e){
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibling.forEach( el => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};


//Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));



// STICKY NAVIGATION INTERSECTIONS OBSERVER API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;

  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
} );

headerObserver.observe(header);



// REVEAL SECTION
const allSection = document.querySelectorAll('.section');

const revealSection = function(entries, observer){
  const [entry] = entries;
  // console.log(entry);
  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection,
  {
    root: null,
    threshold: 0.15,
  });

allSection.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})



// LAZY LOADING IMAGES

const imgTargets = document.querySelectorAll('img[data-src]');

const loading = function(entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if(!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  })

  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loading,
  {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  });

  imgTargets.forEach(img => imgObserver.observe(img));




  // slider
  let curSlide = 0;
  const maxSlide = slides.length;

  // All functions
  const createDots = function() {
    slides.forEach(function(_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend', 
        `<button class = "dots__dot" data-slide = "${i}"></button>`
        );
    });
  };


  const activateDot = function (slide) {
    document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'))

    document.querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
  };


  const goToSlide = function(slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // next slide
  const nextSlide = function() {
    if(curSlide === maxSlide - 1){
      curSlide = 0;
    }else {
      curSlide++;
    };

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  //previous slide
  const prevSlide = function() {
    if(curSlide === 0){
      curSlide = maxSlide;
    }
    curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  }

  const init = function() {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  // event handlers
  btnRight.addEventListener('click', nextSlide); 
  btnLeft.addEventListener('click', prevSlide)

  document.addEventListener('keydown', function(e) {
    // used short circuiting
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });
 

dotContainer.addEventListener('click', function(e) {
  if(e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide); 
  }
});

