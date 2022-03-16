//-- Pour afficher une notification
function displayNotification(id, type, message) {
    let alert = document.querySelector("#" + id);
    alert.innerHTML = message;

    let typeValue = "alert-primary";
    switch (type) {
        case "primary":   typeValue = "alert-primary"; break;
        case "secondary": typeValue = "alert-secondary"; break;
        case "success":   typeValue = "alert-success"; break;
        case "info":      typeValue = "alert-info"; break;
        case "danger":    typeValue = "alert-danger"; break;
        case "warning":   typeValue = "alert-warning"; break;
        case "light":     typeValue = "alert-light"; break;
        case "dark":      typeValue = "alert-dark"; break;
    }

    alert.classList.add(typeValue);
    alert.classList.remove("hide");
    alert.classList.add("show");
    setTimeout(() => {
        alert.classList.remove("show");
        alert.classList.add("hide");
    }, 5*1000);
}