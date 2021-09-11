firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("userBox").style.display = "block";
        userLoggedIn();
        createTeam(user);
        showTeams();
        showTeams2();
        showMsgs();
        showMembers();
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
                    alert("team created");
                    location.reload();
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
    var teamname = doc.data().teamName;
    var mainDiv = document.getElementById("teams");
    var teamDivs = document.createElement("div");
    teamDivs.classList.add("teamData");
    var form = document.createElement("form");
    var input = document.createElement("input");
    var input2 = document.createElement("input");
    input2.setAttribute("type", "hidden");
    var input3 = document.createElement("input");
    input3.setAttribute("type", "button");
    input3.setAttribute("value", "Add member");
    input3.setAttribute("onclick", `add(${teamname})`);
    input2.setAttribute("value", doc.data().teamName);
    input2.setAttribute("id", doc.data().teamName);
    input2.classList.add("msgTeam");
    form.setAttribute("id", "form");
    form.setAttribute("onsubmit", "return false");
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
    var memHeading = document.createElement("h3");
    var members = document.createElement("span");
    members.classList.add("members");
    members.textContent = " Members: "
    teamHeading.classList.add("teamHeading");
    var span = document.createElement("span");
    span.classList.add("admin");
    span.innerText = "admin"
    teamHeading.textContent = doc.data().teamName;
    memHeading.appendChild(members)
    teamDivs.appendChild(span);
    teamDivs.appendChild(input3);
    teamDivs.appendChild(teamHeading);
    teamDivs.appendChild(memHeading);
    teamDivs.appendChild(form);
    mainDiv.appendChild(teamDivs);
}

function add(teamname) {
    var teamName = teamname.value;
    const user = firebase.auth().currentUser;
    var memberName = prompt("Enter name of member");
    // var memberName = document.getElementById("nameOfMember").value;
    var emails = [];
    var emailExists = false;
    db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            emails.push(doc.id)
        });
        for (var i = 0; i < emails.length; i++) {
            if (memberName == emails[i]) {
                emailExists = true;
                break;
            }
        }
        if (emailExists) {
            if (memberName != user.email) {
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
                        location.reload()
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
            }
            else {
                alert("You are admin")
            }
        }
        else {
            alert("User with that email does not exist");
        }
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
    var span = document.createElement("span");
    span.classList.add("member");
    span.innerText = "member";
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
    sender.classList.add("senderName")
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
            alert("Message has been sent!");
            location.reload();
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

function showMembers() {
    const user = firebase.auth().currentUser;
    var admin = [];
    var docRef = db.collection("users/" + user.email + "/teams");
    docRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                admin.push(doc.id);
            })
            var j = -1
            for (var i = 0; i < admin.length; i++) {
                var docRef2 = db.collection("users/" + user.email + "/teams/" + admin[i] + "/members");
                docRef2.get()
                    .then((querySnapshot) => {
                        j++
                        querySnapshot.forEach((doc) => {
                            elementForMembers(doc, j);
                        })
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

}

function elementForMembers(doc, l) {
    var members = document.getElementsByClassName("members")[l];
    members.textContent += doc.id + ", "
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
