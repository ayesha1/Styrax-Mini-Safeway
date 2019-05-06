document.addEventListener('DOMContentLoaded', function() {
  console.log(firebase);
  const auth = firebase.auth();
  const db = firebase.firestore();
  console.log(db);

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
          }
          document.getElementById("guest_message").innerHTML = "You are Eligible for a 10% Discount on All Designated Items!";
        }).catch(function(error) {
          console.error(error.code + ": " + error.message);
        });

      } else {
        console.log("signed in anonymously");
        // window.alert("not logged in");
        document.getElementById("logOut").classList.add("hidden");
        document.getElementById("signIn").classList.remove("hidden");
        document.getElementById("signUp").classList.remove("hidden");
        if (window.location.href.includes("Home.html")) {
          document.getElementById("userName").classList.add("hidden");
          // loadHomeContent();
        }
        // document.getElementById("guest_message").innerHTML = "Sign In and Receive Online Discounts!";
        $('#guest_message').text("Sign In and Receive Online Discounts!")
      }

      $('#nameSearch').submit(e => {
        e.preventDefault();
      })

      if (window.location.href.includes('Home.html')) {
        loadHomeContent();
      } else if (window.location.href.includes('Cart.html')) {
        retrieveCart();
      } else if (window.location.href.includes('Aisles.html')) {
        populateAisles();
      } else if (window.location.href.includes('PaymentPage.html')) {
        retrieveCart();
        loadCheckoutData();
        $('#cartCheckout').on('click', function() {
          addCartToHistory();
        })
      } else if (window.location.href.includes('MyPurchases.html')) {
        if (!auth.currentUser.isAnonymous) {
          loadHistory();
        } else {
          $('#guest_message').text("Sign In to see your previous Purchases");
        }
      } else if (window.location.href.includes('ItemsList.html')) {
        loadItemList();
      } else if (window.location.href.includes("Item.html")) {
        loadSingleItem();
      } else if (window.location.href.includes("OrderReceipt.html")) {
        loadReceipt();
      }
    } else {

      auth.signInAnonymously().catch(error => {
        window.alert(error.code + ": " + error.message);
      });

    }

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

var loadCheckoutData = function () {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const usersRef = db.collection('users');

  if (!auth.currentUser.isAnonymous) {
    usersRef.doc(auth.currentUser.uid).get()
    .then(userDoc => {
      if (userDoc.exists) {
        let user = userDoc.data();
        let userInfo = user.userInfo;
        console.log(user, userDoc);

        $('#cardName').val(userInfo.name);
        $('#reg_address').val(userInfo.address.street);
        $('#reg_city').val(userInfo.address.city);
        $('#reg_state').val(userInfo.address.state);
        $('#zip_code').val(userInfo.address.zip);
      }
    })
    .catch(error => {
      window.alert(error.code + ": " + error.message);
    });
  }
}

var loadReceipt = function() {
  const urlParams = getUrlVars();
  if (!urlParams.r) {
    window.alert("Error: no specified receipt to display.");
    return;
  }
  let receiptId = urlParams.r;
  const db = firebase.firestore();
  const receiptsRef = db.collection('receipts');

  let itemList = [];

  let i = 0;
  receiptsRef.doc(receiptId).get()
  .then(receiptDoc => {
    if (receiptDoc.exists) {
      let receipt = receiptDoc.data();
      console.log("Receipt loaded", receipt);

      $('#orderNumber').text(receiptDoc.id);
      $('#receiptAddr1').text(
        receipt.billingInfo.card.name
        // receipt.billingInfo.address.street
        // receipt.billingInfo.address.city + " " +
        // receipt.billingInfo.address.state + " " +
        // receipt.billingInfo.address.zip
      );
      $('#receiptAddr2').text(
        receipt.billingInfo.address.street + " " +
        receipt.billingInfo.address.city + " "
      );
      $('#receiptAddr3').text(
        receipt.billingInfo.address.state + " " +
        receipt.billingInfo.address.zip
      )
      let paymentCard = receipt.billingInfo.card;
      $('#cardNumber').text("**** **** **** " + paymentCard.number.substring(paymentCard.number.length - 4));
      $('#cardName').text(paymentCard.name);

      let cart = receipt.cart;
      for (let name in cart) {
        let cartItem = cart[name];
        cartItem.ref.get()
        .then(itemDoc => {
          if (itemDoc.exists) {
            let item = itemDoc.data();
            console.log(item, itemDoc);

            itemList.push({
              price: item.originalPrice,
              count: cartItem.count
            });

            $('#cartListReceipt').append($('<div class="itemCart">').attr("id" , ("item"+i)));
            $(("#"+ ("item"+i))).append(
              $('<a class="itemLink">').attr({"href": "./Item.html?i=" + item.name, "id": ("link" + i)}),
              $('<h5 class="itemPriceCart">').text("$" + item.originalPrice.toFixed(2)),
              $('<h5 class="itemQuantity">').text(cartItem.count)//display chosen quantity for each item
            );
            $(("#" + ("link" + i))).append(
              $('<img class="itemImgCart img-responsive">').attr({
                "src": item.imageUrl,
                "alt": item.name
              }),
              $('<h4 class="itemName">').text(item.name)
            );
          }
          i++;
        })
        .then(function() {
          updateCartSummary(itemList);
        })
        .catch(error => {
          window.alert(error.code + ": " + error.message);
        })
      }

    }
  })
  .then(function() {
    updateCartSummary(itemList);
  })
  .catch(error => {
    window.alert(error.code + ": " + error.message);
  });
}

function setUrlParameter(url, k, val) {
  let key = encodeURIComponent(k),
    value = encodeURIComponent(val);

  let baseUrl = url.split('?')[0],
    newParam = key + '=' + value,
    params = '?' + newParam;

  if (url.split('?')[1] == undefined){
    urlQueryString = '';
  } else {
    urlQueryString = '?' + url.split('?')[1];
  }

  if (urlQueryString) {
    let updateRegex = new RegExp('([\?&])' + key + '[^&]*');
    let removeRegex = new RegExp('([\?&])' + key + '=[^&;]+[&;]?');

    if (typeof value === 'undefined' || value === null || value === "") {
      params = urlQueryString.replace(removeRegex, "$1");
      params = params.replace(/[&;]$/, "");

    } else if (urlQueryString.match(updateRegex) !== null) {
      params = urlQueryString.replace(updateRegex, "$1" + newParam);
    } else if (urlQueryString == "") {
      params = '?' + newParam;
    } else {
      params = urlQueryString + '&' + newParam;
    }
  }

  params = params === '?' ? '' : params;

  return baseUrl + params;
}

var searchByName = function addSearchToUrl() {
  console.log(window.location.href)
  console.log(window.location.search);
  let searchText = document.getElementById('searchkeywords').value;

  let baseUrl = window.location.href;
  if (baseUrl.includes("Aisles.html")) {
    baseUrl = baseUrl.slice(0, baseUrl.indexOf("Aisles.html")).concat("ItemsList.html");
  } else if (baseUrl.includes("Home.html")) {
    baseUrl = baseUrl.slice(0, baseUrl.indexOf("Home.html")).concat("ItemsList.html");
  }

  window.location.href = setUrlParameter(baseUrl, "q", searchText);
}

var loadSingleItem = function () {
  const params = getUrlVars();
  const db = firebase.firestore();
  const productsRef = db.collection('products');
  let currentItem = params.i;
  console.log(currentItem);

  productsRef.doc(currentItem).get()
  .then(itemDoc => {
    if (itemDoc.exists) {
      let item = itemDoc.data();
      $('#itemName').text(item.name);
      $('#itemPrice').text("$" + item.originalPrice.toFixed(2));
      $('#itemImg').attr("src", item.imageUrl);
      $('#addCart').on('click', function() {
        addItemToCart(item);
      })
    }
  })
  .catch(error => {
    window.alert(error.code + ": " + error.message);
  });
}

var loadHistory = function () {
  const urlParams = getUrlVars();
  let searchParam;
  let searchFlag = false;
  if (urlParams.q) {
    searchParam = urlParams.q.toLowerCase();
    searchFlag = true;
  }

  const auth = firebase.auth();
  const db = firebase.firestore();
  const historiesRef = db.collection('history');

  let i = 0;
  if (!auth.currentUser.isAnonymous) {
    const userHistoryRef = historiesRef.doc(auth.currentUser.uid);
    userHistoryRef.get()
    .then(historyDoc => {
      if (historyDoc.exists) {
        let history = historyDoc.data();
        console.log(history, historyDoc);

        for (let name in history.items) {
          let itemRef = history.items[name];
          console.log(name, itemRef);

          itemRef.ref.get()
          .then(itemDoc => {
            if (itemDoc.exists) {
              console.log(itemDoc.data());
              let item = itemDoc.data();

              if (!searchFlag || item.name.toLowerCase().includes(searchParam)) {
                $('#aisle').append($('<div class="itemCard">').attr("id", ("item" + i)));             //retrieve item name i
                $(("#" + ("item" + i))).append(
                  $('<a class="itemLink">').attr({"href": ("./Item.html?i=" + item.name), "id": ("link" + i)}),         //link to Item i?
                  $('<h5 class="itemPrice">').text("$" + item.originalPrice.toFixed(2)),                                         //retrieve Item Price at "$1.00"
                  $('<button class="addbtn" onlick="">').text("Add")
                  .on('click', function() {
                    addItemToCart(item);
                  })
                );                                                                                    //add item onclick="addfunction"
                $(("#" + ("link" + i))).append(
                  $('<img class="itemImg img-responsive">').attr(
                    {"src": item.imageUrl, "alt" : item.name}
                  ),        //retrieve item image here
                  $('<div style="overflow: hidden;">').attr("id", ("div"+i))
                );
                var itemName = $('<h4 class="itemName">');
                itemName.text(item.name);
                itemName.attr("id", ("itemName"+i));
                $(("#"+("div"+i))).append(itemName);
                hoverLongName(i);
                i++;
              }
            }
          })
        }
      }
    })
    .catch(error => {
      window.alert(error.code + ": " + error.message);
    });
  }

};

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value.split("%20").join(" ").split("%E2%80%99").join("’");
  });
  return vars;
}

var loadItemList = function () {
  const urlParams = getUrlVars();
  let searchParam;
  let searchFlag = true;
  if (urlParams.q) {
    searchParam = urlParams.q.toLowerCase();
  } else {
    searchFlag = false;
  }

  const db = firebase.firestore();
  const productsRef = db.collection('products');
  let currentAisle = urlParams.a || "all items";
  console.log(urlParams);
  let i = 0;

  let aisleQueryRef = productsRef;
  if (currentAisle != "all items") {
    aisleQueryRef = productsRef.where("aisle", "==", currentAisle);
  }

  $('.aisleName').text(titleCase(currentAisle));

  aisleQueryRef.get()
  .then(querySnapshot => {
    querySnapshot.forEach(itemDoc => {
      if (itemDoc.exists) {
        // console.log(itemDoc.data());
        let item = itemDoc.data();

        if (!searchFlag || item.name.toLowerCase().includes(searchParam)) {
          $('#aisle').append($('<div class="itemCard">').attr("id", ("item" + i)));             //retrieve item name i
          $(("#" + ("item" + i))).append(
            $('<a class="itemLink">').attr({"href": ("./Item.html?i=" + item.name), "id": ("link" + i)}),         //link to Item i?
            $('<h5 class="itemPrice">').text("$" + item.originalPrice.toFixed(2)),                                         //retrieve Item Price at "$1.00"
            $('<button class="addbtn" onlick="">').text("Add")
            .on('click', function() {
              addItemToCart(item);
            })
          );                                                                                    //add item onclick="addfunction"
          $(("#" + ("link" + i))).append(
            $('<img class="itemImg img-responsive">').attr(
              {"src": item.imageUrl, "alt" : item.name}
            ),        //retrieve item image here
            $('<div style="overflow: hidden;">').attr("id", ("div"+i))
          );
          var itemName = $('<h4 class="itemName">');
          itemName.text(item.name);
          itemName.attr("id", ("itemName"+i));
          $(("#"+("div"+i))).append(itemName);
          hoverLongName(i);
          i++;
        }
      }
    })
  })
  .catch(error => {
    window.alert(error.code + ": " + error.message);
  });
}

var addCartToHistory = function () {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const cartsRef = db.collection('carts');
  const usersRef = db.collection('users');
  const historyRef = db.collection('history');
  const receiptsRef = db.collection('receipts');

  let newHistory = {
    items: {}
  };

  cartsRef.doc(auth.currentUser.uid).get()
  .then(doc => {
    if (doc.exists) {
      let cart = doc.data().items;
      console.log(cart);

      //
      // Create Receipt from cart
      //

      let newReceipt = {
        user: auth.currentUser.uid,
        cart: cart,
        subtotal: 0.00,
        discounted: !auth.currentUser.isAnonymous,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        billingInfo: {
          address: {
            street: document.getElementById("reg_address").value,
            city: document.getElementById("reg_city").value,
            state: document.getElementById("reg_state").value,
            country: "United States",
            zip: document.getElementById("zip_code").value
          },
          card: {
            name: document.getElementById("cardName").value || "Ryan Hopper-Lowe",
            number: "4242424242424242"
          }
        }
      };

      receiptsRef.add(newReceipt)
      .then(receiptDoc => {
        console.log("Receipt Created", receiptDoc);
        if (!auth.currentUser.isAnonymous) {

          usersRef.doc(auth.currentUser.uid)
          .collection('receipts').doc(receiptDoc.id).set({
            ref: receiptDoc,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(function() {
            console.log("receipt added to registered user: " + auth.currentUser.uid);
            window.location.href = "./OrderReceipt.html?r=" + receiptDoc.id;
          })
          .catch(error => {
            window.alert(error.code + ": " + error.message);
          })
        } else {
          window.location.href = "./OrderReceipt.html?r=" + receiptDoc.id;
        }
      })
      .catch(error => {
        window.alert(error.code + ": " + error.message);
      });

      //
      //Create History from Cart
      //

      let historyItems = newHistory.items;

      for (let name in cart) {
        // console.log(name, cart[name]);
        historyItems[name] = {
          ref: cart[name].ref,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        // console.log(name, historyItems[name]);
      }
      console.log(newHistory);
      if (!auth.currentUser.isAnonymous) {
        userHistoryRef = historyRef.doc(auth.currentUser.uid);
        userHistoryRef.get()
        .then(historyDoc => {
          let historyData;

          if (historyDoc.exists) {

            historyData = historyDoc.data();
            for (let name in historyItems) {
              historyData.items[name] = historyItems[name];
            }
            console.log(historyData);

          } else {
            historyData = {
              items: historyItems
            };
          }

          userHistoryRef.set(historyData)
          .then(function() {
            console.log("history updated");
          }).catch(error => {
            window.alert(error.code + ": " + error.message);
          });

        }).catch(error => {
          window.alert(error.code + ": " + error.message);
        });
      }
    }
    console.log('cart added to history');
  })
  .then(function() {
    cartsRef.doc(auth.currentUser.uid).delete()
    .then(function() {
      console.log("Cart Deleted");
    })
  })
  .catch(error => {
    window.alert(error.code + ": " + error.message);
  })

}


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
            // console.log(itemList);

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
};

var updateCartSummary = function updateCartSummary(list) {
  const auth = firebase.auth();

  let totalCost = 0.00,
      discountedTotal = 0.00,
      discounts = 0.00,
      tax = 0.00,
      subtotal = 0.00,
      discount = 0.00;

  let numItems = 0;

  const taxRate = 0.09;

  for (item of list) {
    totalCost += item.price * item.count;
    numItems += item.count;
  }

  if (!auth.currentUser.isAnonymous) {
    discount = 0.10;
  }

  discountAmount = totalCost * discount;
  discountedTotal = totalCost - discountAmount;
  tax = discountedTotal * taxRate;
  subtotal = discountedTotal + tax;

  // console.log(totalCost);
  $('#cartPrice').text("$" + totalCost.toFixed(2));
  $('#discounts').text((discount * 100) + "% (-$" + discountAmount.toFixed(2) + ")");
  $('#taxes').text("+$" + tax.toFixed(2));
  $('#totalPrice').text("$" + subtotal.toFixed(2));
  $('#itemNumber').text("Items (" + numItems + ")")

}

var loadHomeContent = function loadHomeContent() {
  const urlParams = getUrlVars();
  let searchParam;
  let searchFlag = false;
  if (urlParams.q) {
    searchParam = urlParams.q.toLowerCase();
    searchFlag = true;
  }

  let i = 0;
  let productsRef = firebase.firestore().collection("products").orderBy("imageUrl").limit(25)
  .get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      let item = doc.data();
      // console.log(item);
      // console.log(doc.id + ": ", doc.data());
      if (!searchFlag || item.name.toLowerCase().includes(searchParam)) {
        $('#PopularAisle').append($('<div class="itemCard">').attr("id", ("item" + i)));
        $(("#" + ("item" + i))).append(
          $('<a class="itemLink">').attr({"href": ("./Item.html?i=" + item.name), "id": ("link" + i)}),         //link to Item i?
          $('<h5 class="itemPrice">').text("$" + item.originalPrice.toFixed(2)),                                         //retrieve Item Price at "$1.00"
          $('<button class="addbtn" id="addItem' + i + '" onlick="addItemToCart(' + i + ')">').text("Add")
        );                                                                                    //add item onclick="addfunction"
        $(("#" + ("link" + i))).append(
          $('<img class="itemImg img-responsive">').attr(
            {"src": item.imageUrl, "alt" : ("item"+i)}),        //retrieve item image here
            $('<div style="overflow: hidden;">').attr("id", ("div"+i))
        );

        $('#' + ('addItem' + i)).on('click', function () {
          addItemToCart(item);
        })

        var itemName = $('<h4 class="itemName">');
        itemName.text(item.name);
        itemName.attr("id", ("itemName"+i));
        $(("#"+("div"+i))).append(itemName);
        hoverLongName(i);
        i++;
      }
    })
  }).catch(error => {
    window.alert(error.code + ": " + error.message);
  });
}

//Cover long name and show when hover
function hoverLongName(i){
  var item = $('#' + ('itemName' + i));
  var canvas = item.canvas || (item.canvas = document.createElement("canvas"));
  var cxt = canvas.getContext("2d");
  var x = cxt.measureText(item.text()).width - (81/1.5);
  // console.log(item.text() +", "+ cxt.measureText(item.text()).width +", "+ x);
  if(cxt.measureText(item.text()).width > 81 && !window.matchMedia("(maxwidth: 768px)").matches){
    item.hover( function(){
      item.css({"transition":"3s", "transform": ("translateX(-" + x + "%)")});
    }, function(){
      item.css({"transition":"1s", "transform": "translateX(0%)"})
    });
  }
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
      state: document.getElementById("reg_state").value,
      zip: document.getElementById("zip_code").value
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
