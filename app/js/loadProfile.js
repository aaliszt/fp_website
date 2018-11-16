(function() {
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
        console.log("initializeApp in loadProfile.js");
        //console.log(app);
    }

    // Fetch an instance of the DB
    const db = firebase.firestore(app);
    //console.log(db);

    // Disable deprecated features
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    // Get page elements to alter
    const fullNameDOM = document.getElementById('name');
    const userTypeDOM = document.getElementById('userType');
    const majorDOM = document.getElementById('major');
    const minorDOM = document.getElementById('minor');
    const graduationDOM = document.getElementById('graduation');
    const emailDOM = document.getElementById('email');
    const websiteDOM = document.getElementById('website');
    const facebookDOM = document.getElementById('facebook');
    const instagramDOM = document.getElementById('instagram');
    const twitterDOM = document.getElementById('twitter');
    const bioDOM = document.getElementById('bio');
	const btnMessage = document.getElementById('btnMessage');
    var editDOM = document.getElementById('editor');

    var initialLoad = true;
    var currentUser = firebase.auth().currentUser;
    var inputUser = document.currentScript.getAttribute('inputUser');
    var editMode = document.currentScript.getAttribute('editmode');

    // Used by queries in onAuthStateChange()
    var inputUsersID = "";
    var fName = "";
    var lName = "";
    var userType = 0;
    var facultyPos = "";
    var major = "";
    var minor = "";
    var gradYear = "";
    var email = "";
    var website = "";
    var bio = "";
    var facebookName = "";
    var instagramName = "";
    var twitterName = "";
    var isVerified = false;
	
	
	// Add message event
    if (btnMessage != null) {
        btnMessage.addEventListener('click', e=> {
			
		}
	}
 
    function LoadProfile(isVerified)
    {
        console.log("Inside loadProfile()");

        if (isVerified)
        {
            // Get additional fields & allow editing of fields (if current user's profile)
        }

        SetBasicFields();
        SetAdditionalFields();
    };
    
    function SetBasicFields()
    {
        fullNameDOM.innerHTML = fName + " " + lName;
        emailDOM.innerHTML = email;
        SetUserType(userType);
    };

    function SetUserType(type)
    {
        switch (type)
        {
            case 1:
            userType = "Student";
            break;
            case 2:
            userType = "Alumni";
            break;
            case 3:
            userType = "Faculty";
            break;
            default:
            userType = "None";
            break;
        }

        userTypeDOM.innerHTML = userType;
    };

    function GetAdditionalFields(userID)
    {
        db.collection('Profiles').doc(userID).get()
        .then(function(querySnapshot){
            var doc = querySnapshot;
                facultyPos = String(doc.get("faculty_position"));
                major = String(doc.get("major"));
                minor = String(doc.get("minor"));
                gradYear = String(doc.get("graduation_year"));
                website = String(doc.get("website"));
                bio = String(doc.get("bio"));
                facebookName = String(doc.get("facebook"));
                instagramName = String(doc.get("instagram"));
                twitterName = String(doc.get("twitter"));

                LoadProfile(isVerified);
        })
        .catch(function(error){
            console.log("Error getting document ID: ", error);
        });
    };

    function SetAdditionalFields()
    {
        if (editMode)
        {
            majorDOM.value = major;
            minorDOM.value = minor;
            graduationDOM.value = gradYear;
            websiteDOM.value = website;
            websiteDOM.value = website;
            bioDOM.value = bio;
            facebookDOM.value = facebookName;
            instagramDOM.value = instagramName;
            twitterDOM.value = twitterName;
        }
        else
        {
            majorDOM.innerHTML = major;
            minorDOM.innerHTML = minor;
            graduationDOM.innerHTML = gradYear;
            websiteDOM.innerHTML = website;
            websiteDOM.href = "http://" + website;
            bioDOM.innerHTML = bio;
            facebookDOM.href = "https://www.facebook.com/" + facebookName;
            instagramDOM.href = "https://www.instagram.com/" + instagramName;
            twitterDOM.href = "https://www.twitter.com/" + twitterName;
        }
    };

    firebase.auth().onAuthStateChanged(user => {
        if (user)
        {
            currentUser = user;

            // View this user's profile
            if (inputUser)
            {
                email = String(inputUser + "@kent.edu");

                db.collection("Users").where("email", "==", email)
                    .get()
                    .then(function(querySnapshot){
                        var doc = querySnapshot.docs[0];
                        inputUsersID = String(doc.id);
                        fName = String(doc.get("first_Name"));
                        lName = String(doc.get("last_Name"));
                        userType = doc.get("userType");
                        isVerified = doc.get("verified");

                        GetAdditionalFields(inputUsersID);
                    })
                    .catch(function(error){
                        console.log("Error getting document ID: ", error);
                    });
            }
        
            // View your own
            else
            {
                db.collection('Users').doc(currentUser.uid).get()
                .then(function(querySnapshot){
                    var doc = querySnapshot;
                    fName = String(doc.get("first_Name"));
                    lName = String(doc.get("last_Name"));
                    email = String(doc.get("email"));
                    userType = doc.get("userType");
                    isVerified = doc.get("verified");
                    isCurrentUser = true;
                    GetAdditionalFields(currentUser.uid);
                })
                .catch(function(error){
                    console.log("Error getting document ID: ", error);
                });
            }
        }
        else
        {
            // User is not logged in and shouldn't be able to see anyone's profile.
        }
    });
}());
