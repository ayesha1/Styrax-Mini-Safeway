//scroll function for fixed search bar
function searchScroll() {
  if(document.documentElement.scrollTop > $("#searchbar").position().top-50
    || document.body.scrollTop > $("#searchbar").position().top-50) {
      $("#searchbar").css({"position": "fixed", "top": "50px", "width": "100%", "left": "0%"});
  }
  if(document.documentElement.scrollTop < $("#searchbar-origin-position").position().top-50
    || document.body.scrollTop > $("#searchbar-origin-position").position().top-50){
      $("#searchbar").css({"position": "absolute", "top": "auto", "width": "55%", "left": "22%"});
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
