
$('#styrax-nav').load('/components/templates/navbar.html #styraxNav');

$('#styrax-footer').load('/components/templates/footer.html #styraxFooter');

$('#styrax-searchbar').load('/components/templates/searchbar.html #nameSearch');

$(document).ready(function() {
  if (window.location.href.includes("Cart.html")) {
    $('#navCart').addClass('activeNav');
  } else if (window.location.href.includes("SignIn.html")) {
    $('#navLogin').addClass('activeNav');
  } else if (window.location.href.includes("SignUp.html")) {
    $('#navSignUp').addClass('activeNav');
  }
})
