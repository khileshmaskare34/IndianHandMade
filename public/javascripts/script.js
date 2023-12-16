// new kursor({
//   type: 1,
//   color: "rgb(68,72,87)",
//   // removeDefaultCursor: true,

// })
var loader = document.querySelector('#loader');
window.addEventListener('load', function () {
  loader.style.display = 'none';
});

var swiper = document.querySelector('.swiper');
var drag = document.querySelector('.drag');
var swiperwrapper = document.querySelector('.swiper-wrapper');

// swiper.addEventListener("mousemove",function(dets){
//     drag.style.left=dets.x-150+"px";
//     drag.style.top=dets.y-150+"px";
// })

// swiperwrapper.addEventListener('mousemove', function () {
//   drag.style.scale = 2;
// });
// swiperwrapper.addEventListener('mouseleave', function () {
//   drag.style.scale = 0;
// });



// ***************************slider code ******************************


function Slider() {
  const carouselSlides = document.querySelectorAll('.slide');
  const btnPrev = document.querySelector('.prev');
  const btnNext = document.querySelector('.next');
  const dotsSlide = document.querySelector('.dots-container');
  let currentSlide = 0;

  const activeDot = function (slide) {
      document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
      document.querySelector(`.dot[data-slide="${slide}"]`).classList.add('active');
  };
  activeDot(currentSlide);

  const changeSlide = function (slides) {
      carouselSlides.forEach((slide, index) => (slide.style.transform = `translateX(${100 * (index - slides)}%)`));
  };
  changeSlide(currentSlide);

  btnNext.addEventListener('click', function () {
      currentSlide++; 
      if (carouselSlides.length - 1 < currentSlide) {
          currentSlide = 0;
      };
      changeSlide(currentSlide);
      activeDot(currentSlide);
});
  btnPrev.addEventListener('click', function () {
      currentSlide--;
      if (0 >= currentSlide) {
          currentSlide = 0;
      }; 
      changeSlide(currentSlide);
      activeDot(currentSlide);
  });

  dotsSlide.addEventListener('click', function (e) {
      if (e.target.classList.contains('dot')) {
          const slide = e.target.dataset.slide;
          changeSlide(slide);
          activeDot(slide);
      }
  });
};
Slider();
