
document.addEventListener('DOMContentLoaded', function() {
  console.log(firebase.auth());
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
  const storageRef = storage.ref();
  console.log(db);

  var loadContent = function () {
    var appleRef = db.collection("products").doc("Apple").get().then(function(doc) {
      console.log(doc.data());
      var item = doc.data();

      document.getElementById("name1").innerHTML = item.name;
      document.getElementById("aisle1").innerHTML = item.aisle;
      document.getElementById("price1").innerHTML = item.price;
      document.getElementById("stock1").innerHTML = item.stock;
      document.getElementById("img1").src = item.imageUrl;


    }).catch(function(error) {
      window.alert(error.code + ": " + error.message);
    });


  }
  loadContent();
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  auth.onAuthStateChanged(user => {
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
        document.getElementById("logOut").classList.remove("hidden");

        // loadContent();

      }).catch(function(error) {
        window.alert("couldn't get user data", error.code, error.message);
      });

    } else {
      document.getElementById("logOut").classList.add("hidden");
      document.getElementById("signIn").classList.remove("hidden");
    }
    console.log(auth.currentUser)
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

function cropImage() {
  let file = $('#item_image').get(0).files[0];
  let uncropped_image = URL.createObjectURL(file);

  $('#item_cropper').get(0).src = uncropped_image;
  console.log(document.getElementById("item_cropper").src);

  var cropper = new Croppie(document.getElementById("item_cropper"), {
    viewport: {
      height: 200,
      width: 200
    },
    enforceBoundary: false
  });

  $('#crop_result').on('click', function (event) {
    cropper.result({
      type: "blob",
      format: "jpeg"
    }).then(function(blob) {
      let cropped_image = URL.createObjectURL(blob);
      blob.lastModifiedDate = new Date();
      blob.name = file.name;
      console.log(blob);
      console.log(cropped_image);
      $('#cropped_image').get(0).src = cropped_image;
    });
  })
}

function addItemToFirestore() {
  let newItem = {
    name: document.getElementById("item_name").value,
    originalPrice: document.getElementById("item_price").value,
    aisle: document.getElementById("item_aisle").value,
    stock: document.getElementById("item_stock").value,
    imageUrl: "",
    image: ""
  };

  let file = $('#item_image').get(0).files[0];
  console.log(newItem, file);

  let imageMetaData = {
    contentType: file.type
  }

  var task = firebase.storage().ref().child("images/" + newItem.name + "_" + file.name).put(file, imageMetaData)
  .then(snapshot => {
    newItem.image = snapshot.ref.toString();
    return snapshot.ref.getDownloadURL();
  })
  .then(url =>  {
    newItem.imageUrl = url;
    console.log(newItem);

    firebase.firestore().collection("products").doc(newItem.name).set(newItem).then(function(success) {
      window.alert("Item Successfully added to Firebase!");
    }).catch(error => {
      window.alert(error.code + ": " + error.message);
    })
  })
  .catch(error => {
    window.alert(error.code + " " + error.message);
  });
}

function handleLogin(){
  let email = document.getElementById("login_email").value;
  let password = document.getElementById("login_password").value;

  firebase.auth().signInWithEmailAndPassword(email, password).then(function() {

    // window.alert("Login success");
    // window.location.href = "./Home.html";
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
