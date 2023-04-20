function onSubmitClicked(event) {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let errorMessage = document.getElementById("error_message");

  console.log("Form submission fired");
  console.log("Has a form");
  event.preventDefault();

  if (!email.value.trim()) {
    email.value = "";
    errorMessage.hidden = false;
    errorMessage.innerHTML = "Please enter an email";
  } else if (!password.value.trim()) {
    password.value = "";
    errorMessage.hidden = false;
    errorMessage.innerHTML = "Please enter a password";
  } else {
    errorMessage.hidden = true;
    document.getElementById("login_form").submit();
  }
}
