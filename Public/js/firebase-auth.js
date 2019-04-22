
document.addEventListener('DOMContentLoaded', function() {
  console.log(firebase.auth());
  const auth = firebase.auth();
  const db = firebase.firestore();
  console.log(db);
  var loaded_items;

  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  auth.onAuthStateChanged(user => {
    loaded_items = [];
    //if user is authenticated
    if (user) {
      //retrieve user's personal doc using their uid
      var userRef = db.collection("users").doc(user.uid);
      var userInfo;
      //retrieve basic user info
      userRef.get().then(function(doc) {
        if (doc.exists) {
          userInfo = doc.data().userInfo;
          console.log(doc.data());
          console.log(userInfo);
        } else {
          console.log("could not find user document");
        }

        document.getElementById("signIn").classList.add("hidden");
        document.getElementById("signUp").classList.add("hidden");
        document.getElementById("logOut").classList.remove("hidden");
        if (window.location.href.includes("Home.html")) {
          document.getElementById("userName").classList.remove("hidden");
          document.getElementById("userName").innerHTML = "Hi " + userInfo.name + "!";
          document.getElementById("guest_message").innerHTML = "You are Eligible for a 10% Discount on All Designated Items!";
          loadHomeContent();
        }


      }).catch(function(error) {
        window.alert(error.code, error.message);
      });

    } else {
      // window.alert("not logged in");
      document.getElementById("logOut").classList.add("hidden");
      document.getElementById("signIn").classList.remove("hidden");
      document.getElementById("signUp").classList.remove("hidden");
      if (window.location.href.includes("Home.html")) {
        document.getElementById("userName").classList.add("hidden");
        document.getElementById("guest_message").innerHTML = "Sign In and Receive Online Discounts!";
        loadHomeContent();
      }
    }


    var listItems = [];


    console.log(auth.currentUser);

    var populateListFields = function (items) {
      setTimeout(function (){
        console.log(items);
        for (let i in items) {
          $('#PopularAisle').append($('<div class="itemCard">').attr("id", ("item" + i)));
          $(("#" + ("item" + i))).append(
            $('<a class="itemLink">').attr({"href": ("link" + i), "id": ("link" + i)}),         //link to Item i?
            $('<h5 class="itemPrice">').text("$" + items[i].originalPrice),                                         //retrieve Item Price at "$1.00"
            $('<button class="addbtn" onlick="">').text("Add")
          );                                                                                    //add item onclick="addfunction"
          $(("#" + ("link" + i))).append(
            $('<img class="itemImg img-responsive">').attr(
              {"src": items[i].imageUrl, "alt" : ("item"+i)}),        //retrieve item image here
              $('<h4 class="itemName">').text(items[i].name)
          );
        }
      }, 1000);
    }

    var loadHomeContent = function getAllProducts() {
      loaded_items = [];
      let i = 0;
      var productsRef = db.collection("products").limit(20)
      .get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let item = doc.data();
          // console.log(doc.id + ": ", doc.data());
          loaded_items[i] = item;
          i++;
        })
      }).catch(error => {
        window.alert(error.code + ": " + error.message);
      });
      console.log(loaded_items);
      // pageSetup(loaded_items);
      listItems = loaded_items;
      console.log(loaded_items.length);
      populateListFields(loaded_items);
    }


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
  let newUser = {
    name: document.getElementById("reg_name").value,
    email: email,
    address: {
      street: document.getElementById("reg_address").value,
      city: document.getElementById("reg_city").value,
      state: document.getElementById("reg_state").value
    }
  };

  console.log(email, password);
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
    let userId = firebase.auth().currentUser.uid;
    console.log(userId);
    firebase.firestore().collection("users").doc(userId).set({
      "userInfo": newUser
    }).then(function (docRef) {
      window.alert("success");
      console.log(docRef);
    }).catch(function(error) {
      window.alert(error.code, error.message);
    })

    // window.location.href = "./Home.html";
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
