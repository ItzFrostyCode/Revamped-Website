// Theme toggle is now properly handled in games-main.js

// Basic script file for game functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Game script loaded');
});




window.addEventListener('scroll', function() {
  var header = document.querySelector('header');
  var heroBanner = document.getElementById('Hero-Banner');
  var topBar = document.querySelector('.top-bar');

  // Check if the page is scrolled past the Hero-Banner
  if (window.scrollY >= heroBanner.offsetTop) {
      header.classList.add('scrolled'); // Add class to change header color
  } else {
      header.classList.remove('scrolled'); // Remove class when scrolling back up
  }
});


let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Dot controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");

  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

document.getElementById('submitBtn').addEventListener('click', function(event) {
  event.preventDefault(); // Prevents the form from actually submitting (you can replace it with form submission logic)

  // Display the success message
  document.getElementById('successMessage').style.display = 'block';
  
  // Optionally, you can hide the success message after a few seconds:
  setTimeout(function() {
      document.getElementById('successMessage').style.display = 'none';
  }, 2000); // Hide after 3 seconds
});