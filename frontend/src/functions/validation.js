export function validateUserDto(userDto) {
  const { username, email, password } = userDto;
  const errors = {
    username: '',
    email: '',
    password: ''
  };

  // Validation username
  if (username === '') {
    errors.username = "Username is empty";
  } else {
    let usernameError = '';
    if (username.length < 3) {
      usernameError = "Username must be at least 3 characters.";
    }
    if (username.length > 40) {
      usernameError = "Username cannot be longer than 40 characters.";
    }
    const usernameRegex = /^[a-zA-Z0-9]+([-]?[a-zA-Z0-9]+)*$/;
    if (!usernameRegex.test(username)) {
      usernameError = "Username may only contain alphanumeric characters or hyphens";
    }
    if (usernameError.length > 0) {
      errors.username = usernameError;
    }
  }

  // Validation email
  if (!email) {
    errors.email = "Email is empty";
  } else {
    const emailRegex = /^[a-zA-Z0-9]+([-_.]?[a-zA-Z0-9]+)*[@]{1}[a-zA-Z0-9]+([-_]{1}[a-zA-Z0-9]+)*([.]{1}[a-zA-Z0-9]{2,})+$/;
    if (!emailRegex.test(email)) {
      errors.email = "The email is invalid. Please try again.";
    }
  }

  // Validation password
  let passwordError = validatePassword(password);
  if (passwordError.length > 0) {
    errors.password = passwordError;
  }
  return errors;
}

export function validatePassword(password) {
  let passwordError = '';
  if (!password) {
    passwordError = "Password is empty";
  } else {
    if (password.length < 8 || password.length > 30) {
      passwordError = "Password must contain at least 8 characters and no more than 30 characters.";
    }
    const hasUppercase = /(?=.*[A-Z])/.test(password);
    const hasLowercase = /(?=.*[a-z])/.test(password);
    const hasDigit = /(?=.*\d)/.test(password);
    const hasSpecialCharacter = /(?=.*[!@#$%^&*(){}\]\[<>\|~])/.test(password);
    if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialCharacter) {
      passwordError = 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  }
  return passwordError
}

export function validationProjectData(projectData) {
  const errors = { name: '', description: '' };

  if (!projectData.name || projectData.name.length < 3 || projectData.name.length > 50) {
    errors.name = 'The name of the project is less than 3 characters';
  }

  if (projectData.description.length > 1500) {
    errors.description = 'The description of the project is longer than 1500 characters';
  }

  return errors;
}