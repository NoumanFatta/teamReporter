firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("userBox").style.display = "block";
        userLoggedIn();
        createTeam(user);
        showTeams();
        showTeams2();
        showMsgs();
    } else {
        document.getElementById("loginBox").style.display = "block";
        document.getElementById("userBox").style.display = "none";
    }
});

function login() {
    var email = document.getElementById("username").value;
    var password = document.getElementById("pass").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            alert("login succesfull")
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
}
function userLoggedIn() {
    const user = firebase.auth().currentUser;
    document.getElementById("greetUser").innerHTML = user.email;
}

function logout() {
    firebase.auth().signOut().then(() => {
        alert("logging out");
    }).catch((error) => {
    });
}
function createTeam(user) {
    document.getElementById("createNewTeam").addEventListener(
        "click",
        () => {
            var teamName = document.getElementById("teamName").value;
            var docRef = db.collection('users').doc(user.email).collection('teams').doc(teamName);
            docRef.set(
                {
                    teamName
                }
            )
            db.collection("teams").doc(teamName).set({
                teamName
            })
                .then(() => {
                    alert("team created")
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        }
    )
}
function showTeams() {
    const user = firebase.auth().currentUser;
    id = -1
    db.collection("users/" + user.email + "/teams").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            id++
            // doc.data() is never undefined for query doc snapshots
            elementForTeams(doc, id);
        });
    });
}

function elementForTeams(doc, id) {
    var mainDiv = document.getElementById("teams");
    var teamDivs = document.createElement("div");
    teamDivs.classList.add("teamData");
    var input = document.createElement("input");
    var input2 = document.createElement("input");
    input2.setAttribute("type", "hidden");
    input2.setAttribute("value", doc.data().teamName);
    input2.setAttribute("id", doc.data().teamName);
    input2.classList.add("msgTeam");
    var form = document.createElement("form");
    form.setAttribute("id", "form");
    form.setAttribute("onsubmit", "return false")
    var btn = document.createElement("button");
    btn.setAttribute("type", "submit");
    btn.setAttribute("id", id)
    btn.setAttribute("onclick", "reply(this.id)");
    btn.innerHTML = "Reply";
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Reply");
    input.classList.add("msgInput");
    form.appendChild(input2);
    form.appendChild(input);
    form.appendChild(btn);
    var teamHeading = document.createElement("h3");
    teamHeading.classList.add("teamHeading");
    var memberDetails = document.createElement("p");
    var span = document.createElement("span");
    span.classList.add("admin");
    span.innerText = "admin"
    memberDetails.classList.add("member-details")
    teamDivs.appendChild(memberDetails);
    teamHeading.textContent = doc.data().teamName;
    teamDivs.appendChild(span);
    teamDivs.appendChild(teamHeading);
    teamDivs.appendChild(form)
    mainDiv.appendChild(teamDivs);
}

function add() {
    const user = firebase.auth().currentUser;
    var teamName = document.getElementById("nameOfTeam").value;
    var memberName = document.getElementById("nameOfMember").value;
    var docRef = db.collection('users').doc(user.email).collection('teams').doc(teamName).collection("members").doc(memberName);
    docRef.set(
        {
            memberName
        }
    )
    db.collection("users/" + memberName + "/" + "member").doc(teamName).set(
        {
            teamName
        }
    )
        .then(() => {
            alert("member added")
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

function showTeams2() {
    const user = firebase.auth().currentUser;
    db.collection("users/" + user.email + "/member").get().then((querySnapshot) => {
        var admins = document.getElementsByClassName("admin");
        j = admins.length;
        querySnapshot.forEach((doc) => {
            elementForTeams2(doc, j);
            j++
        });
    });
}
function elementForTeams2(doc, id) {
    var mainDiv = document.getElementById("teams");
    var teamDivs = document.createElement("div");
    teamDivs.classList.add("teamData");
    var input = document.createElement("input");
    var input2 = document.createElement("input");
    input2.setAttribute("type", "hidden");
    input2.setAttribute("value", doc.data().teamName);
    input2.setAttribute("id", doc.data().teamName);
    input2.classList.add("msgTeam");
    var form = document.createElement("form");
    form.setAttribute("id", "form");
    form.setAttribute("onsubmit", "return false")
    var btn = document.createElement("button");
    btn.setAttribute("type", "submit");
    btn.setAttribute("id", id)
    btn.setAttribute("onclick", "reply(this.id)");
    btn.innerHTML = "Reply";
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Reply");
    input.classList.add("msgInput");
    form.appendChild(input2);
    form.appendChild(input);
    form.appendChild(btn);
    var teamHeading = document.createElement("h3");
    teamHeading.classList.add("teamHeading");
    var memberDetails = document.createElement("p");
    var span = document.createElement("span");
    span.classList.add("member");
    span.innerText = "member"
    memberDetails.classList.add("member-details")
    teamDivs.appendChild(memberDetails);
    teamHeading.textContent = doc.data().teamName;
    teamDivs.appendChild(span);
    teamDivs.appendChild(teamHeading);
    teamDivs.appendChild(form)
    mainDiv.appendChild(teamDivs);
}
function showMsgs() {
    db.collection("teams").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            checkTeams(doc);
        });
    });
}
function checkTeams(doc) {
    var teamName = document.getElementById(doc.data().teamName);
    if (teamName) {
        db.collection("teams/" + doc.data().teamName + "/questions").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                elementForReplies(doc, teamName.value);
            });
        });
    }

}
function elementForReplies(doc, teamName) {
    const user = firebase.auth().currentUser;
    var teamsdata = document.getElementsByClassName("teamData");
    var teamHeading = document.getElementsByClassName("teamHeading")
    var msg = document.createElement("p");
    msg.classList.add("msg");
    msg.innerHTML = doc.data().question;
    var sender = document.createElement("span");
    if (doc.data().sender == user.email) {
        sender.innerHTML = " -You";
    }
    else {
        sender.innerHTML = " -" + doc.data().sender;
    }
    msg.appendChild(sender)
    for (var i = 0; i < teamsdata.length; i++) {
        if (teamHeading[i].innerHTML == teamName) {
            teamsdata[i].appendChild(msg)
            break;
        }
    }
}
function reply(id) {
    const user = firebase.auth().currentUser;
    var teamName = document.getElementsByClassName("msgTeam");
    var msg = document.getElementsByClassName("msgInput");
    db.collection("teams/" + teamName[id].value + "/questions").doc().set({
        question: msg[id].value,
        sender: user.email
    })
        .then(() => {
            alert("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}


function signup() {
    var email = document.getElementById("username").value;
    var password = document.getElementById("pass").value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("Sign Up scuesfull")
            db.collection("users").doc(email).set({
                email: email,
                password: password
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
        });
}