import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFullName', async: false })
export class IsFullNameConstraint implements ValidatorConstraintInterface {
  validate(name: string) {
    return name.split(' ').length >= 2;
  }

  defaultMessage() {
    return 'The name must be a full name with at least first and last name.';
  }
}
