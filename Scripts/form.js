let form = document.getElementById('form');
let username = document.getElementById('username');
let email = document.getElementById('email');
let password = document.getElementById('password');
let password2 = document.getElementById('password2');
let phoneNumber = document.getElementById('phone');
let message = document.getElementById('message');
let charCount = document.getElementById('charCount');

/*-> Blur event listeners are added to detect when the user leaves the field and checks if it is valid */
username.addEventListener('blur', () => validateUsername());
email.addEventListener('blur', () => validateEmail());
password.addEventListener('blur', () => validatePassword());
password2.addEventListener('blur', () => validatePassword2());
phoneNumber.addEventListener('blur', () => validatePhoneNumber());

form.addEventListener('submit', e => {
    e.preventDefault();
    validateForm();
    validateMessage(); 
});

/*-> function takes an input element and error message as params 
  -> this function finds and displays the error message*/
const setError = (element, message) => {
    const inputControl = element.parentElement;    
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

/*->Finds and displays any success indicators */

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

// checks for valid email characters
const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());

}

//checks name only contains letters and spaces
const isValidName = name => {
    const re = /^[a-zA-Z\s]+$/;
    return re.test(String(name));
}

//checks password is 8 characters min and contains a number and special character
const isValidPassword = password => {
    const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return re.test(password);
}

//checks number is 10 digits only
const isValidPhoneNumber = number => {
    const re = /^\d{10}$/;
    return re.test(number);
}

message.addEventListener('input', () => {     //inout event listener tracks the character count
    const currentLength = message.value.length;
    charCount.textContent = `${currentLength}/200 characters`;

    // Check if character limit is reached
    if (currentLength > 200) {
        setError(message, "Message cannot exceed 200 characters.");
    } else {
        setSuccess(message);
    }
});

// checks if username field is empty or invalid
const validateUsername = () => {
    const usernameValue = username.value.trim();
    if (usernameValue === '') {
        setError(username, 'Name is required');
    } else if (!isValidName(usernameValue)) {
        setError(username, 'Name must only contain letters and spaces');
    } else {
        setSuccess(username);
    }
};

const validateEmail = () => {
    const emailValue = email.value.trim();
    if (emailValue === '') {
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }
};

const validatePassword = () => {
    const passwordValue = password.value.trim();
    if (passwordValue === '') {
        setError(password, 'Password is required');
    } else if (!isValidPassword(passwordValue)) {
        setError(password, 'Password must be at least 8 characters, include a number and a special character');
    } else {
        setSuccess(password);
    }
};


//passwords must be the same
const validatePassword2 = () => {
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();
    if (password2Value === '') {
        setError(password2, 'Please confirm your password');
    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords don't match");
    } else {
        setSuccess(password2);
    }
};

const validatePhoneNumber = () => {
    const phoneValue = phoneNumber.value.trim();
    if (phoneValue === '') {
        setError(phoneNumber, 'Phone number is required');
    } else if (!isValidPhoneNumber(phoneValue)) {
        setError(phoneNumber, 'Phone number must be 10 digits long');
    } else {
        setSuccess(phoneNumber);
    }
};

const validateMessage = () => {
    const messageValue = message.value.trim();
    if (messageValue === '') {
        setError(message, 'Message is required');
    } else if (messageValue.length > 200) {
        setError(message, 'Message cannot exceed 200 characters');
    } else {
        setSuccess(message);
    }
};

// Form validation on submit
const validateForm = () => {
    validateUsername();
    validateEmail();
    validatePassword();
    validatePassword2();
    validatePhoneNumber();

    const isFormValid = document.querySelectorAll('.input.error').length === 0;

    if (isFormValid) {
        successMessage.style.display = 'block';  // Show success message
        form.reset();  // Clear the form
        clearSuccessStyles();  //  clear success styles from fields
    }
};

//Clears success styles from form fields after submission
const clearSuccessStyles = () => {
    document.querySelectorAll('.input.success').forEach(input => {
        input.classList.remove('success');
    });
};
