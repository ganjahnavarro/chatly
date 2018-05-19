let Alert = {};

Alert.error = function(message) {
    console.error(message);

    let element = document.getElementById("snackbar");
    element.className = "show";
    element.innerHTML = message;
    setTimeout(() => element.className = element.className.replace("show", ""), 3000);
};

export default Alert;
