window.onload = function() {
  activeMainOpt()
};

window.onscroll = function () {
  if($('#searchbar').length > 0){
    searchScroll()
  }
  backToTopScroll()
};

$(document).ready(function(){
  MainOptHover()
  backToTopClick()
});

//Change Heading Style for Main Options (Aisles/My Purchases)
function activeMainOpt(){
  var elt;
  if(window.location.href.includes("MyPurchases.html")){
    elt = $('#MyPurchasesOpt');
  }else{
    elt = $('#AislesOpt');
  }
  if(window.location.href.includes("Aisles.html")){
    elt.removeAttr("href");
    elt.css("cursor","default");
  }
  elt.removeClass("mainOptions");
  elt.addClass("AisleHeading");
}

//Change Heading Style for Main Options when hover (Aisles/My Purchases)
function MainOptHover(){
  var elt1;
  var elt2;
  if(window.location.href.includes("MyPurchases.html")){
    elt1 = $('#MyPurchasesOpt');
    elt2 = $('#AislesOpt');
  }else{
    elt1 = $('#AislesOpt');
    elt2 = $('#MyPurchasesOpt');
  }
  elt2.mouseover( function(){
    elt1.attr("href","./Aisles.html");
    elt1.addClass("mainOptions");
    elt1.removeClass("AisleHeading");
  });
  elt2.mouseout( function(){
    if(window.location.href.includes("Aisles.html")){
      elt1.removeAttr("href");
    }
    elt1.removeClass("mainOptions");
    elt1.addClass("AisleHeading");
  });
}

//scroll function for fixed search bar
function searchScroll() {
  if(document.documentElement.scrollTop > $("#searchbar").position().top-50
    || document.body.scrollTop > $("#searchbar").position().top-50) {
      $("#searchbar").css({"position": "fixed", "top": "50px", "width": "100%", "left": "0%"});
  }
  if(document.documentElement.scrollTop < $("#searchbar-origin-position").position().top-50
    || document.body.scrollTop > $("#searchbar-origin-position").position().top-50){
      $("#searchbar").css({"position": "absolute", "top": "auto", "width": "70%", "left": "15%"});
  }
}

//scroll function for Back to Top Button
function backToTopScroll() {
  if(document.documentElement.scrollTop > 300
    || document.body.scrollTop > 300) {
      $("#backToTop").fadeIn();
    } else{
      $("#backToTop").fadeOut();
    }
  };

//Scroll Top function: slowly scroll to top of page when Back To Top Button is clicked
function backToTopClick(){
  $("#backToTop").click(function(e){
    e.preventDefault();
    $("html, body").animate({scrollTop: 0}, "slow");
  });
}

//increase quantity of an item
function increaseValue(e) {
  var value = e.value;
  value = isNaN(value) ? 1 : value;
  value++;
  e.value = value;
}
//decrease quantity of an item
function decreaseValue(e) {
  var value = e.value;
  value = isNaN(value) ? 1 : value;
  value < 1 ? value = 1 : '';
  value--;
  e.value = value;
}
