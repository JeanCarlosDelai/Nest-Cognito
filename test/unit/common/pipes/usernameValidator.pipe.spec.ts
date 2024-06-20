import { UsernameValidator } from 'src/shared/common/pipes/usernameValidator.pipe';

describe('ValidaCPF', () => {
  let validaCPF: UsernameValidator;

  beforeEach(() => {
    validaCPF = new UsernameValidator();
  });

  test('Deve retornar true para um CPF válido', () => {
    const cpf = '529.982.247-25';
    expect(validaCPF.validate(cpf)).toBe(true);
  });

  test('Deve retornar false para um CPF inválido', () => {
    const cpf = '123.456.789-00';
    expect(validaCPF.validate(cpf)).toBe(false);
  });

  test('Deve retornar false para um valor que não é uma string', () => {
    const cpf = 111;
    expect(validaCPF.validate(cpf as unknown as string)).toBe(false);
  });

  test('Deve retornar false se o CPF tiver menos digitos que 11', () => {
    const cpf = '111';
    expect(validaCPF.validate(cpf)).toBe(false);
  });
  test('Deve retornar a mensagem padrão para CPF inválido', () => {
    expect(validaCPF.defaultMessage()).toBe(
      'Please provide a valid username, format:  012345678900'
    );
  });
});
