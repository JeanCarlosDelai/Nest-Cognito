import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { parse, isValid, format } from 'date-fns';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';

@ValidatorConstraint({ name: 'birthdate', async: false })
export class BirthdateValidator implements ValidatorConstraintInterface {
  validate(birthdate: string) {
    if (typeof birthdate !== 'string') return false;
    const parsedDate = parse(birthdate, 'dd/MM/yyyy', new Date());
    return (
      isValid(parsedDate) && format(parsedDate, 'dd/MM/yyyy') === birthdate
    );
  }

  defaultMessage() {
    return ThrowsMessages.IVALID_BIRTHDATE_VALIDATION;
  }
}
