const getName     = document.getElementById("inputName");
const getMail     = document.getElementById("inputEmail");
const getPassword = document.getElementById("inputPassword");

function submitRegistration(ev) {
    ev.preventDefault();
    const name     = getName.value;
    const email    = getMail.value;
    const password = getPassword.value;
    axios
        .post("http://127.0.0.1:8080/auth/signup", {
            name,
            email,
            password,
        })
        .then(function (response) {
            console.log(response);
            window.location.href = "http://127.0.0.1:8080/";
        })
        .catch(function (error) {
            let statusError = error.response.status;
            
            if (statusError === 400) {
                displayNotification("blockAlert", "info", "Certaines données sont manquantes, veuillez réessayer");
            } else if (statusError === 403) {
                displayNotification("blockAlert", "danger", "Impossible d'ajouter un utilisateur, l'adresse mail doit être unique");
            } else if (statusError === 500) {
                displayNotification("blockAlert", "danger", "Problème avec le serveur, veuillez réessayer plus tard");
            }
        });
}

const registrationForm = document.getElementById("registrationForm");
registrationForm.addEventListener("submit", submitRegistration);
