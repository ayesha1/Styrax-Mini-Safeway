// var firebase = require("firebase/app");
console.log("firebase");

// Initialize Firebase
var app = {
  apiKey: "AIzaSyDCp28n1nRZomkupguisYl-lUZhKQKCE8E",
  authDomain: "styrax-mini-safeway.firebaseapp.com",
  databaseURL: "https://styrax-mini-safeway.firebaseio.com",
  projectId: "styrax-mini-safeway",
  storageBucket: "styrax-mini-safeway.appspot.com",
  messagingSenderId: "156521397776"
};
firebase.initializeApp(app);

document.addEventListener('DOMContentLoaded', function() {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // firebase.auth().onAuthStateChanged(user => { });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  try {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
  } catch (e) {
    console.error(e);
  }
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    alert(user);
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
  } else {
    // User is signed out.
    // ...
    console.log("not logged in");
  }
});

function handleSignUp() {
  var email = document.getElementById('reg_email').value;
  var password = document.getElementById('reg_password').value;
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  // Sign in with email and pass.
  // [START createwithemail]
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END createwithemail]
}

function handleLogin() {
  var email = document.getElementById('login_email').value;
  var password = document.getElementById('login_password').value;

//  firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
//    console.log("login successful");
//    alert("login successful");
//  }).catch(function (error) {
//    var errorCode = error.code;
//    var errorMessage = error.message;
//    alert('login unsuccessful');
//    alert(errorCode, errorMessage);
//    console.log(errorCode);
//    console.log(errorMessage);
//  })
//    console.log("test");
//    alert("test");
//}
firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
      alert('login unsuccessful');
      alert(errorCode, errorMessage);
      console.log(errorCode);
      console.log(errorMessage);

});
  alert(email);
  alert(password);
}
function handleLogout() {
  firebase.auth().signOut().then(function() {
    console.log("logout successful");
    alert('logout success');
  }).catch(function(error) {
    let errorCode = error.code;
    let errorMessage = error.message;
    alert('logout failed')
    console.log(errorCode);
    console.log(errorMessage);
  });
}

var cartRef = firebase.database().ref("cart/");

cartRef.set ({
   John: {
      item: apple, orange

   },

   Amanda: {
      item: apple
   }
});
