const hostUrl = "http://localhost:5000";

const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");
const rememberField = document.getElementById("remember");
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
        showPassword = false;
    } else {
        eyeBtn.classList.remove("fa-eye-slash");
        eyeBtn.classList.add("fa-eye");
        passwordField.type = "text";
        showPassword = true;
    }
});


document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault();
    const username = usernameField.value;
    const password = passwordField.value;
    const remember = rememberField.checked;

    // send a http post request to the server
    const newUser = { username, password, remember };
    const http = new XMLHttpRequest();
    const url = hostUrl + "/api/user/login";
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