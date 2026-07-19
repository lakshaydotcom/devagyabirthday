import { parsePhoneNumberFromString } from "libphonenumber-js";

const RAW_NUMBER = "+91 70150 98950";
const MESSAGE = "Hi Lakshay ❤️";

const parsed = parsePhoneNumberFromString(RAW_NUMBER, "IN");

if (!parsed || !parsed.isValid()) {
  throw new Error(`Invalid phone number configured: ${RAW_NUMBER}`);
}

const e164 = parsed.format("E.164"); // +917015098950
const e164NoPlus = e164.replace(/^\+/, ""); // 917015098950
const encodedMessage = encodeURIComponent(MESSAGE);

export const phone = {
  raw: RAW_NUMBER,
  e164,
  e164NoPlus,
  international: parsed.formatInternational(),
  national: parsed.formatNational(),
  telHref: `tel:${e164}`,
  smsHref: `sms:${e164}?body=${encodedMessage}`,
  waHref: `https://wa.me/${e164NoPlus}?text=${encodedMessage}`,
  waDeepLink: `whatsapp://send?phone=${e164NoPlus}&text=${encodedMessage}`,
  message: MESSAGE,
} as const;
