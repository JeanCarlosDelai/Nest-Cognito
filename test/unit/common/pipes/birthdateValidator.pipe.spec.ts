import { BirthdateValidator } from 'src/shared/common/pipes/birthdateValidator.pipe';

describe('BirthdateValidator', () => {
  let validator: BirthdateValidator;

  beforeEach(() => {
    validator = new BirthdateValidator();
  });

  it('should return false for non-string input', () => {
    expect(validator.validate((1234567890).toString())).toBe(false);
    expect(validator.validate(null as unknown as string)).toBe(false);
    expect(validator.validate(undefined as unknown as string)).toBe(false);
    expect(validator.validate({} as unknown as string)).toBe(false);
  });

  it('should return false for invalid birthdates', () => {
    expect(validator.validate('31/02/2020')).toBe(false); // Data inválida
    expect(validator.validate('2020/02/31')).toBe(false); // Formato errado
    expect(validator.validate('12-31-2020')).toBe(false); // Formato errado
    expect(validator.validate('31/12/20')).toBe(false); // Ano incompleto
    expect(validator.validate('abcd/ef/ghij')).toBe(false); // Não numérico
    expect(validator.validate('')).toBe(false); // String vazia
  });

  it('should return true for valid birthdates', () => {
    expect(validator.validate('01/01/2000')).toBe(true);
    expect(validator.validate('29/02/2020')).toBe(true); // Ano bissexto
    expect(validator.validate('15/08/1995')).toBe(true);
    expect(validator.validate('31/12/2023')).toBe(true); // Data futura
  });

  it('should return the correct default message', () => {
    expect(validator.defaultMessage()).toBe(
      'Please provide a valid birthdate, format: dd/MM/yyyy'
    );
  });
});
