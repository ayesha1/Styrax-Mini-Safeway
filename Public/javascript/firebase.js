db collection('users').get().then((snapshot) => {snapshot.docs.forEach(doc => {console.log(doc)})})
