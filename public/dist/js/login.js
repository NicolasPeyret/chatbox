const getMail = document.getElementById("inputEmail");
const getPassword = document.getElementById("inputPassword");

function submitLogin(ev) {
  ev.preventDefault();
  const email = getMail.value;
  const password = getPassword.value;
  axios
    .post("http://127.0.0.1:8080/auth/login", {
      email,
      password,
    })
    .then(function (response) {
      console.log(response);
      window.location.href = "http://127.0.0.1:8080/";
    })
    .catch((error) => {
      let statusError = error.response.status
      if (statusError === 401) {
        displayNotification("blockAlert", "danger", "L'identifiant ou le mot de passe est incorrect");
      } else if (statusError === 500) {
        displayNotification("blockAlert", "danger", "Problème avec le serveur, veuillez réessayer plus tard");
      }
    });
}

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", submitLogin);
