(function() {
       
    const connectedUserList = document.querySelector('#connected-user-list');
    const connectedFriendsList = document.querySelector('#connected-friends-list');

    // =======================================================
    //	Create elements and render friends list
    //

    function openMessengerWith(value){
        var friend_id = String(value);
		var current_id = String(uid);
		var found=false;
		var sessionID = '';		
		
		firestore.collection("Chat-Groups").where("user_1", "==", friend_id).where("user_2", "==", current_id)
			.get().then(function(results) {
			if (results.empty) {
				sessionID='';
			} else {
                var doc = results.docs[0];
                sessionID = String(doc.id);
				var messengerURL = 'https://focalpointkent.pythonanywhere.com/messenger?sid=' + sessionID;
				window.open(messengerURL, '_blank', 'height=500,width=400,top=100,left=100');
			}
        })
		.then(function(){
			if(sessionID == ''){
				firestore.collection("Chat-Groups").where("user_1", "==", current_id).where("user_2", "==", friend_id)
					.get().then(function(results) {
						if (results.empty) {
							firestore.collection("Chat-Groups").add({
								user_1: current_id,
								user_2: friend_id
							}).then(function(){
								firestore.collection("Chat-Groups").where("user_2", "==", friend_id).where("user_1", "==", current_id)
									.get()
									.then(function(querySnapshot){
										var doc = querySnapshot.docs[0];
										sessionID = String(doc.id);
										found = true;
										firestore.collection("Chat-Groups").doc(sessionID).collection("Messages").add({
											messages_approved: "true"
										})
										var messengerURL = 'https://focalpointkent.pythonanywhere.com/messenger?sid=' + sessionID;
										window.open(messengerURL, '_blank', 'height=500,width=400,top=100,left=100');
									})
									.catch(function(error){
										console.log("Error getting document: ", error);
									});
							}).catch(function(error){
								console.error("Error writing collection: ", error);
							});
						} else {
							var doc = results.docs[0];
							sessionID = String(doc.id);
							var messengerURL = 'https://focalpointkent.pythonanywhere.com/messenger?sid=' + sessionID;
							window.open(messengerURL, '_blank', 'height=500,width=400,top=100,left=100');
						}
					})
			}
		});
    }

	
	
    // =======================================================
    //	Create elements and render friends list
    //

    function renderFriendsList(doc1){
		var friendProfile = firestore.collection('Users').doc(doc1.id).get()
			.then(doc => {
				if (!doc.exists) {
				} else {
					if (!(uid == doc.id)){
						var first_name = String(doc.get("first_Name"));
						var last_name = String(doc.get("last_Name"));
						var displayName = first_name + ' ' + last_name;
						var but = document.createElement("button");
						but.setAttribute("value", doc1.id);
						but.id = doc1.id;
						but.innerHTML = displayName;
						but.setAttribute("class", "btn btn-primary btn-lg btnMessage");
						connectedFriendsList.appendChild(but);
						attachClickEvent(doc1.id);
					}
				}
			})
			.catch(err => {
				console.log('Error getting document', err);
			});

    }

    function attachClickEvent(value){
        var friendButton = document.getElementById(value); // Button object for friend uid
		if (friendButton != null) {
			friendButton.addEventListener('click', 
			function(){
				openMessengerWith(value);
			}, false);
		}
    }

	
	
    // =======================================================
    // Check for initialized firebase connection
    //
    if (!firebase.apps.length) {
        var config = {
            apiKey: "AIzaSyCEuT1gco387t16C2IAmN2bx5bt-n6ea6s",
            authDomain: "focal-point-student-alumni-net.firebaseapp.com",
            databaseURL: "https://focal-point-student-alumni-net.firebaseio.com",
            projectId: "focal-point-student-alumni-net",
            storageBucket: "focal-point-student-alumni-net.appspot.com",
            messagingSenderId: "1002904582612"
        } 
        firebase.initializeApp(config);
    }

    // =======================================================
    // Fetch an instance of the DB
    //
    const firestore = firebase.firestore();
    firestore.settings( {timestampsInSnapshots: true} );
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    // =======================================================
    // Check for user being logged in
    //

    firebase.auth().onAuthStateChanged(function(user) {
    if (user) { // if user is authorized
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                        // this value to authenticate with your backend server, if
                        // you have one. Use User.getToken() instead.
        
        // =======================================================
        //	Pulls all docs from 'Friends' collection in firebase
        //	and lists them. Friend's list will show each friend's
        //  display name or user name. 'Message' button next to
        //  each friend's name. 'Message' button click will bring
        //	up the conversation.
        //
		
        firestore.collection('Users').doc(uid).collection('Friends').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
				firestore.collection("Users").doc(uid).collection("Blocks").where("uid_blocked", "==", doc.id)
				.get()
					.then(function(querySnapshot){
						if(querySnapshot.empty) {		// Should be true if there are no documents with the blocked UID,
							renderFriendsList(doc);		// Otherwise (empty) should be false
						}
					})                             
					.catch(function(error){
						console.log("Error getting document: ", error);
					});
						
				});
            });
        
    } else { // If user is not authorized
        console.log('User is not authorized to access this webpage');
    }
	
    });
}());
