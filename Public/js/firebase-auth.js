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
      if (!user.isAnonymous) {
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
            // loadHomeContent();
          }


        }).catch(function(error) {
          window.alert(error.code, error.message);
        });

      } else {
        console.log("signed in anonymously");
        // window.alert("not logged in");
        document.getElementById("logOut").classList.add("hidden");
        document.getElementById("signIn").classList.remove("hidden");
        document.getElementById("signUp").classList.remove("hidden");
        if (window.location.href.includes("Home.html")) {
          document.getElementById("userName").classList.add("hidden");
          document.getElementById("guest_message").innerHTML = "Sign In and Receive Online Discounts!";
          // loadHomeContent();
        }
      }

      if (window.location.href.includes('Home.html')) {
        loadHomeContent();
      } else if (window.location.href.includes('Cart.html')) {
        retrieveCart();
      } else if (window.location.href.includes('Aisles.html')) {
        populateAisles();
      }
    } else {

      auth.signInAnonymously().catch(error => {
        window.alert(error.code + ": " + error.message);
      });

    }

    // console.log(auth.currentUser);

    addItemToCart = function(item) {
      let cartsRef = db.collection('carts');
      let productsRef = db.collection('products');
      let itemRef = productsRef.doc(item.name);
      console.log(item);

      var userCart;
      cartsRef.doc(auth.currentUser.uid)
      .get()
      .then(doc => {

        console.log(doc);
        if (doc.exists) {
          userCart = doc.data();
          if (userCart.items[item.name]) {
            userCart.items[item.name].count++;
          } else {
            userCart.items[item.name] = {
              ref: itemRef,
              count: 1
            }
          }
          console.log(userCart);
          cartsRef.doc(auth.currentUser.uid).update(userCart);

        } else {

          let newCart = {
            items: {}
          };

          newCart.items[item.name] = {
            ref: itemRef,
            count: 1
          };
          console.log(newCart);
          cartsRef.doc(auth.currentUser.uid).set(newCart);

        }
      })
      .catch(error => {
        window.alert(error.code + ": " + error.message);
      });
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


function titleCase(str) {
  if (!str.includes(" ")) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  let splitStr = str.split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

var populateAisles = function () {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const aislesRef = db.collection('aisles');


  let i = 0;
  aislesRef.limit(20).get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      let aisle = doc.data();
      // console.log(aisle, doc);
      let displayName = titleCase(aisle.name);

      $('#aisles').append($('<div class="aisleCard">').attr("id", ("Aisle"+i)));
      $(("#"+("Aisle"+i))).append($('<a class="itemLink">').attr({"href": ("./ItemsList.html?a=" + aisle.name), "id": ("link" + i)}));
      $(("#"+("link" + i))).append(
        $('<div>').text(displayName),
        $('<img class="itemImg img-responsive">').attr({"src": aisle.imageUrl, "alt": displayName})
      );

      i++;
    })
  })

}

var addItemToCart;
var retrieveCart = function () {
  const db = firebase.firestore();
  const auth = firebase.auth();
  const cartsRef = db.collection('carts');

  var cart;
  cartsRef.doc(auth.currentUser.uid)
  .get()
  .then(doc => {
    if (doc.exists) {

      cart = doc.data();
      console.log(cart);
      let cartItems = cart.items;

      let itemList = [];

      let i = 1;
      for (let name in cartItems) {
        console.log(name, cartItems[name]);

        let item = cartItems[name];

        cartItems[name].ref.get()
        .then(function(itemDoc) {

          if (itemDoc.exists) {
            // console.log(itemDoc.data());
            let itemData = itemDoc.data();
            itemList.push({
              price: itemData.originalPrice,
              count: item.count
            });
            console.log(itemList);

            $('#cartList').append($('<div class="itemCart">').attr("id" , ("item"+i)));
            $(("#"+ ("item"+i))).append(
              $('<a class="itemLink">').attr({"href": ("link" + i), "id": ("link" + i)}),
              $('<h5 class="itemPriceCart">').text("$" + itemData.originalPrice.toFixed(2)),
              $('<form class="quantityBox">').attr("id" , ("form"+i))
            );
            $(("#" + ("link" + i))).append(
              $('<img class="itemImgCart img-responsive">').attr({
                "src": itemData.imageUrl,
                "alt": (itemData.name)
              }),
              $('<h4 class="itemName">').text((itemData.name))
            );
            var input = "input" + i;
            var decrease = $('<div class="quantityBtn decBtn">');
            decrease.attr("onclick", "decreaseValue(" + input + ")");
            var increase = $('<div class="quantityBtn incBtn">');
            increase.attr("onclick", "increaseValue(" + input + ")");
            $(("#" + ("form"+i))).append(
              decrease.text("-"),
              $('<input class="inputQuantity" type="number">').attr({"id": input, "value": item.count}),
              increase.text("+")
            );

            decrease.on('click', function() {
              cart.items[name].count--;
              // console.log(cart.items[name].count);
              cartsRef.doc(auth.currentUser.uid).update(cart).then(function() {
                // window.alert("cart updated");
                // updateCartSummary(itemList);
                window.location.href = "";
              }).catch(error => {
                window.alert(error.code + ": " + error.message);
              });
            });

            increase.on('click', function() {
              cart.items[name].count++;
              // console.log(cart.items[name].count);
              cartsRef.doc(auth.currentUser.uid).update(cart).then(function() {
                // console.log("cart updated");
                // updateCartSummary(itemList);
                window.location.href = "";
              }).catch(error => {
                window.alert(error.code + ": " + error.message);
              });
            });
            i++;
          }

        })
        .then(function() {

          updateCartSummary(itemList);

        }).catch(error => {
          window.alert(error.code + ": " + error.message);
        });
      }
    }
  })

  function updateCartSummary(list) {
    let totalCost = 0.00,
        discountedTotal = 0.00,
        discounts = 0.00,
        tax = 0.00,
        subtotal = 0.00,
        discount = 0.00;

    const taxRate = 0.09;

    for (item of list) {
      totalCost += item.price * item.count;
    }

    if (!auth.currentUser.isAnonymous) {
      discount = 0.10;
    }

    discountAmount = totalCost * discount;
    discountedTotal = totalCost - discountAmount;
    tax = discountedTotal * taxRate;
    subtotal = discountedTotal + tax;

    console.log(totalCost);
    $('#cartPrice').text("$" + totalCost.toFixed(2));
    $('#discounts').text((discount * 100) + "% (-$" + discountAmount.toFixed(2) + ")");
    $('#taxes').text("+$" + tax.toFixed(2));
    $('#totalPrice').text("$" + subtotal.toFixed(2));

  }
};

var loadHomeContent = function loadHomeContent() {
  let i = 0;
  let productsRef = firebase.firestore().collection("products").limit(20)
  .get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      let item = doc.data();
      console.log(item);
      // console.log(doc.id + ": ", doc.data());
      $('#PopularAisle').append($('<div class="itemCard">').attr("id", ("item" + i)));
      $(("#" + ("item" + i))).append(
        $('<a class="itemLink">').attr({"href": ("link" + i), "id": ("link" + i)}),         //link to Item i?
        $('<h5 class="itemPrice">').text("$" + item.originalPrice.toFixed(2)),                                         //retrieve Item Price at "$1.00"
        $('<button class="addbtn" id="addItem' + i + '" onlick="addItemToCart(' + i + ')">').text("Add")
      );                                                                                    //add item onclick="addfunction"
      $(("#" + ("link" + i))).append(
        $('<img class="itemImg img-responsive">').attr(
          {"src": item.imageUrl, "alt" : ("item"+i)}),        //retrieve item image here
          $('<h4 class="itemName">').text(item.name)
      );

      $('#' + ('addItem' + i)).on('click', function () {
        addItemToCart(item);
      })
      i++;
    })
  }).catch(error => {
    window.alert(error.code + ": " + error.message);
  });
}

function handleLogin(){
  const auth = firebase.auth();

  deleteAnonymousCart();

  let email = document.getElementById("login_email").value;
  let password = document.getElementById("login_password").value;

  auth.signInWithEmailAndPassword(email, password).then(function() {
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

  deleteAnonymousCart();

  console.log(email, password);
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
    let userId = firebase.auth().currentUser.uid;
    console.log(userId);
    firebase.firestore().collection("users").doc(userId).set({
      "userInfo": newUser
    }).then(function (docRef) {
      // window.alert("success");
      console.log(docRef);
      window.location.href = './Home.html';
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

function deleteAnonymousCart() {
  const auth = firebase.auth();
  const db = firebase.firestore();

  if (auth.currentUser && auth.currentUser.isAnonymous) {
    db.collection('carts').doc(auth.currentUser.uid).delete().then(function() {
      // window.alert('cart deleted');
    }).catch(error => {
      window.alert(error.code + ": " + error.message);
    });
  }
}

function handleCheckout() {

    window.location.href ="./PaymentPage.html";
}
