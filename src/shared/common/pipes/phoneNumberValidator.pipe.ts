import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';

@ValidatorConstraint({ name: 'phoneNumber', async: false })
export class PhoneNumberValidator implements ValidatorConstraintInterface {
  validate(phoneNumber: string) {
    if (typeof phoneNumber !== 'string') return false;
    const phoneRegex = /^\+55[0-9]{2}[0-9]?[0-9]{4}[0-9]{4}$/;
    return phoneRegex.test(phoneNumber);
  }

  defaultMessage() {
    return ThrowsMessages.IVALID_PHONE_NUMBER_VALIDATION;
  }
}
