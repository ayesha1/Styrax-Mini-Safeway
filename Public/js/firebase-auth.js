
document.addEventListener('DOMContentLoaded', function() {
  console.log(firebase.auth());
  const db = firebase.firestore();
  console.log(db);

  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // window.alert(user);
      document.getElementById("signIn").classList.add("hidden");
      document.getElementById("signUp").classList.add("hidden");
      document.getElementById("logOut").classList.remove("hidden");
      if (window.location.href.includes("Home.html")) {
        document.getElementById("userName").classList.remove("hidden");
        document.getElementById("userName").innerHTML = "Hi!";
        document.getElementById("guest_message").innerHTML = "You are Eligible for a 10% Discount on All Designated Items!";
      }

    } else {
      // window.alert("not logged in");
      document.getElementById("logOut").classList.add("hidden");
      document.getElementById("signIn").classList.remove("hidden");
      document.getElementById("signUp").classList.remove("hidden");
      if (window.location.href.includes("Home.html")) {
        document.getElementById("userName").classList.add("hidden");
        document.getElementById("guest_message").innerHTML = "Sign In and Receive Online Discounts!";
      }
    }
    console.log(firebase.auth().currentUser)
  });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  try {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage', 'firestore'].filter(feature => typeof app[feature] === 'function');
    // document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
  } catch (e) {
    console.error(e);
    // document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
  }

});

function handleLogin(){
  let email = document.getElementById("login_email").value;
  let password = document.getElementById("login_password").value;

  firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    // window.alert("Login success");
    window.location.href = "./Home.html";
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert(errorCode, errorMessage);
  });
}

function registerUser() {
  let email = document.getElementById("reg_email").value;
  let password = document.getElementById("reg_password").value;

  console.log(email, password);
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
    window.location.href = "./Home.html";
  })
  .catch(function (error) {
    window.alert("Registration Unsuccessful");
  });
}

function handleLogout() {

  firebase.auth().signOut().then(function() {
    // window.alert("logout success");
  }).catch(function(error) {
    window.alert("logout Unsuccessful");
  });
}

function handleCheckout() {

    window.location.href ="./PaymentPage.html";
}

function completeCheckout() {


}
