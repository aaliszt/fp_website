(function() {
    // Database config
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
        console.log("initializeApp in reset.js");
        console.log(app);
    }

    // Fetch an instance of the DB
    const db = firebase.firestore(app);
    console.log(db);
    console.log(firebase.app().name);

    // Disable deprecated features
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    // Get elements/user input
    const btnDelAcct = document.getElementById('btnDelAcct');

    // Add password reset event
    if (btnDelAcct != null) {
        btnDelAcct.addEventListener('click', e=> {
            swal({
                title:             "Are you sure you wish to delete your account?",
                text:              "Password verification is an upcoming feature.",
                type:              "warning",
                showCancelButton:  true,
                confirmButtonText: "Delete It!"
            });
        });
    }
}());
