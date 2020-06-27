const hostUrl = "http://localhost:3000";

const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");
const confirmField = document.getElementById("confirm-password");
const eyeBtn = document.getElementById("show-password");
const infoDiv = document.querySelector(".info-container");
const infoSpan = document.getElementById("info-msg");

function showInfo(info) {
    infoSpan.innerHTML = info;
    infoDiv.classList.remove("hide");
}


// show and hide password
let showPassword = false;

eyeBtn.addEventListener("click", () => {
    if(showPassword) {
        eyeBtn.classList.remove("fa-eye");
        eyeBtn.classList.add("fa-eye-slash");
        passwordField.type = "password";
        confirmField.type = "password";
        showPassword = false;
    } else {
        eyeBtn.classList.remove("fa-eye-slash");
        eyeBtn.classList.add("fa-eye");
        passwordField.type = "text";
        confirmField.type = "text";
        showPassword = true;
    }
});


// submit the form to the server
document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault();
    const username = usernameField.value;
    const password = passwordField.value;
    const confirm = confirmField.value;

    // send a http post request to the server
    const newUser = { username, password, confirm };
    const http = new XMLHttpRequest();
    const url = hostUrl + "/api/user/register";
    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json");

    http.onreadystatechange = () => {
        // state 4: done
        if (http.readyState !== 4) {
            return;
        }

        if (http.status === 200) {
            showInfo("success");
            console.log(http.responseText);
        } else {
            showInfo(http.responseText);
        }
    };
    http.send(JSON.stringify(newUser));
});