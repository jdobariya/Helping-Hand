function onSubmitClicked(){
    let firstName = document.getElementById('first_name');
    let lastName = document.getElementById('last_name');
    let password = document.getElementById('password');
    let repeatPassword = document.getElementById('repeat_password');
    let errorMessage = document.getElementById('error_message');
  
    console.log('Form submission fired');
    console.log('Has a form');
    event.preventDefault();

    if (!firstName.value.trim()) {
      firstName.value = '';
      errorMessage.hidden = false;
      errorMessage.innerHTML = 'Please enter a first name';
    } else if(!lastName.value.trim()) {
      lastName.value = '';
      errorMessage.hidden = false;
      errorMessage.innerHTML = 'Please enter a last name';
    }
    else if (!password.value.trim()) {
      password.value = '';
      errorMessage.hidden = false;
      errorMessage.innerHTML = 'Please enter a password';
    }
    else if (!repeatPassword.value.trim()) {
      repeatPassword.value = '';
      errorMessage.hidden = false;
      errorMessage.innerHTML = 'Please re-enter your password';
    }
    else if (password.value.trim() !== repeatPassword.value.trim()) {
      password.value = '';
      repeatPassword.value = '';
      errorMessage.hidden = false;
      errorMessage.innerHTML = 'Passwords do not match';
    }
    else {
      errorMessage.hidden = true;
      document.getElementById('signup_form').submit();
    }
  }