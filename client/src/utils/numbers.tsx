import { parsePhoneNumberWithError } from 'libphonenumber-js';


export const formatPhone = (raw: string) => {
  try {
    const number = parsePhoneNumberWithError(raw, 'DZ');
    return number.formatNational();
  } catch (error) {
    return raw;
  }
};

