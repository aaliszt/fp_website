(function() {
    console.log(firebase.apps.length);
    if (!firebase.apps.length) {
        var config = {
		    apiKey: "AIzaSyCEuT1gco387t16C2IAmN2bx5bt-n6ea6s",
		    authDomain: "focal-point-student-alumni-net.firebaseapp.com",
		    databaseURL: "https://focal-point-student-alumni-net.firebaseio.com",
		    projectId: "focal-point-student-alumni-net",
		    storageBucket: "focal-point-student-alumni-net.appspot.com",
		    messagingSenderId: "1002904582612"
	    };
			
        var app = firebase.initializeApp(config);
        console.log("initializeApp in registerUser.js");
        //console.log(app);
    }

    // Fetch an instance of the DB
    const db = firebase.firestore(app);
    //console.log(db);

    // Disable deprecated features
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    // // Get elements/user input
    // const btnSignup = document.getElementById('btnSignup');
    // const userSelect = document.getElementById("user_type_selection");

    // const firstName = document.getElementById('txtFirstName');
    // const lastName = document.getElementById('txtLastName');
    // const password = document.getElementById('txtPassword');
    // const password2 = document.getElementById('txtPassword2');
    // const userType = userSelect.options[userSelect.selectedIndex].text;

    var initialLoad = true;
    var user = document.currentScript.getAttribute('user');
    var profileToLoad; 

    if (user)
    {
        var email = user + "@kent.edu";

        firebase.auth().fetchProvidersForEmail(email)
        .then(providers => {
          if (providers.length === 0) {
            // User not registered. Show an error on the page that says there is no profile for that user
          } else {
            // User is registered
            profileToLoad = providers[0].uid;
          }
        });   
    }

    
    // TO-DO: Add some sort of parsing functionality to sanitize user-input
    function AddUserToDB(currentUID, currentEmail){
        console.log('Adding user to firestore.');

        // Convert HTMLElements to strings to store in DB
        var sFirstName = String(firstName.value);
        var sLastName = String(lastName.value);
        var currentUserType = 0;

        // Set userType based on information given by user
        // 1 == Student | 2 == Alumni | 3 == Faculty
        if(userType == "Student") {
            currentUserType = 1;
        }
        else if(userType == "Alumni") {
            currentUserType = 2;
        }
        else {       
            currentUserType = 3;
        }

        // Create new document in 'Users' collection
        db.collection("Users").doc(currentUID).set({   // Need to confirm that 'currentUID' is properly converted to a string
            first_Name: sFirstName,
            last_Name: sLastName,
            email: currentEmail,                          
            userType: currentUserType,
            userID: currentUID,
            verified: false
        })
        .then(function(){
            console.log("Users documents successfully written!");
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });

        // Create new document in the 'Profiles' collection
        // Fields must be populated later when users provide more information
        db.collection("Profiles").doc(currentUID).set({
            major: "Fill in Major",
            minor: "Fill in Minor",
            bio: "Bio goes here",
            faculty_position: "test-position",
            website: "test-website.com",
            facebook: "facebook-link",
            instagram: "insta-link",
            twitter: "twitter-link",
            graduation_year: "2010",
            userID: currentUID
        })
        .then(function(){
            console.log("Profile documents successfully written!");
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });

        // Create new document in the 'Blocks' collection
        // Feilds must be populated at the time of the block
        // Blocking requires a merge with the existing feilds
        db.collection("Blocks").doc(currentUID).set({                  
            uid: currentUID
        })
        .then(function(){
            console.log("Blocks documents successfully written!");
        })
        .catch(function(error){
            console.error("Error writing document: ", error);
        });
		
		// Create new collection 'Friends' for each user
		db.collection("Users").doc(currentUID).collection("Friends").doc(currentUID).set({
			uid: currentUID
		})
		.then(function(){
            console.log("Friends collection successfully written!");
        })
        .catch(function(error){
            console.error("Error writing collection: ", error);
        });
    };

    firebase.auth().onAuthStateChanged(user => {
        if(user && !initialLoad) {

            // Get current user ID  & email and convert them to strings
            var currentUID = user.uid;
            var sID = String(currentUID);
            var currentEmail = user.email;
            var sEmail = String(currentEmail);
        }
    });
}());