export enum ThrowsMessages {
  USER_NAME_EXISTS_EXCEPTION = 'User already exists',
  USER_NOT_FOUND_EXCEPTION = 'User does not exist.',
  USER_CLIENT_NOT_FOUND_EXCEPTION = 'Username/client id combination not found.',
  INVALID_ACCESS_TOKEN = 'Could not verify signature for Access Token',
  CODE_MISMATCH_EXCEPTION = 'Invalid verification code provided, please try again.',
  INCORRECT_PASSWORD = 'Incorrect username or password.',

  //Validation Pipes
  IVALID_USERNAME_VALIDATION = 'Please provide a valid username, format:  012345678900',
  IVALID_PHONE_NUMBER_VALIDATION = 'Please provide a valid phoneNumber, format: +5554987654321',
  IVALID_BIRTHDATE_VALIDATION = 'Please provide a valid birthdate, format: dd/MM/yyyy',

  //Unauthorized
  UNAUTHORIZED = 'Unauthorized',
}
