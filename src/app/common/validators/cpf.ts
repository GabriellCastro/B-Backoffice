import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'isCPF', async: false })
export class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(cpfInput: string) {
    return cpf.isValid(cpfInput);
  }

  defaultMessage() {
    return 'CPF is not valid.';
  }
}
