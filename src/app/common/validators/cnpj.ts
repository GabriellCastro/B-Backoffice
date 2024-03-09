import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'isCNPJ', async: false })
export class IsCNPJConstraint implements ValidatorConstraintInterface {
  validate(cnpjInput: string) {
    return cnpj.isValid(cnpjInput);
  }

  defaultMessage() {
    return 'CNPJ is not valid.';
  }
}
