import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

export const isPhoneValid = (phone: string) => {
  if (!phone) return false;
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    console.error(error);
    return false;
  }
};


export const formatToInternational = (phoneNumber: string): string => {
  try {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const PNF = PhoneNumberFormat;
    
    if (phoneNumber.startsWith('+')) {
      try {
        const parsedNumber = phoneUtil.parse(phoneNumber, '');
        if (phoneUtil.isValidNumber(parsedNumber)) {
          return phoneUtil.format(parsedNumber, PNF.INTERNATIONAL);
        }
      } catch (e) {
        return phoneNumber;
      }
    } else {
      const regions = phoneUtil.getSupportedRegions();
      
      for (const region of regions) {
        try {
          const possibleNumber = phoneUtil.parse(phoneNumber, region);
          if (phoneUtil.isValidNumber(possibleNumber)) {
            return phoneUtil.format(possibleNumber, PNF.INTERNATIONAL);
          }
        } catch (e) {
        }
      }
    }
    
    return phoneNumber;
    
  } catch (error) {
    return phoneNumber;
  }
};

export default formatToInternational;