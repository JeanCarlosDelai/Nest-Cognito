import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ThrowsMessages } from 'src/shared/providers/aws/cognito/enum/throwsMessages.enum';

@ValidatorConstraint({ name: 'usernameValida', async: false })
export class UsernameValidator implements ValidatorConstraintInterface {
  validate(username: string) {
    if (typeof username !== 'string') return false;
    username = username.replace(/[^\d]+/g, '');
    if (username.length !== 11 || !!username.match(/(\d)\1{10}/)) return false;
    const values = username.split('').map(el => +el);
    const rest = (count: number) =>
      ((values
        .slice(0, count - 12)
        .reduce((soma, el, index) => soma + el * (count - index), 0) *
        10) %
        11) %
      10;

    return rest(10) === values[9] && rest(11) === values[10];
  }

  defaultMessage() {
    return ThrowsMessages.IVALID_USERNAME_VALIDATION;
  }
}
