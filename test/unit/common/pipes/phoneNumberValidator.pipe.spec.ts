import { PhoneNumberValidator } from 'src/shared/common/pipes/phoneNumberValidator.pipe';

describe('PhoneNumberValidator', () => {
  let validator: PhoneNumberValidator;

  beforeEach(() => {
    validator = new PhoneNumberValidator();
  });

  it('should return false for non-string input', () => {
    expect(validator.validate(1234567890 as unknown as string)).toBe(false);
    expect(validator.validate(null)).toBe(false);
    expect(validator.validate(undefined)).toBe(false);
  });

  it('should return false for invalid phone numbers', () => {
    expect(validator.validate('+551')).toBe(false);
    expect(validator.validate('+551234567890123')).toBe(false);
    expect(validator.validate('+55abc56789012')).toBe(false);
  });

  it('should return true for valid phone numbers', () => {
    expect(validator.validate('+5512345678901')).toBe(true);
    expect(validator.validate('+5511998765432')).toBe(true);
    expect(validator.validate('+5521998765432')).toBe(true);
    expect(validator.validate('+5531987654321')).toBe(true);
  });

  it('should return the correct default message', () => {
    expect(validator.defaultMessage()).toBe(
      'Please provide a valid phoneNumber, format: +5554987654321'
    );
  });
});
