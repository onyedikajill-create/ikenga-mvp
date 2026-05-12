// ============================================================
// DISPOSABLE EMAIL DOMAIN BLOCKLIST
// Common throwaway / temporary email providers.
// Block these at login to protect the conversion funnel.
// ============================================================

const DISPOSABLE_DOMAINS = new Set([
  // Major disposable providers
  "guerrillamail.com", "guerrillamail.net", "guerrillamail.org",
  "guerrillamail.biz", "guerrillamail.de", "guerrillamail.info",
  "guerrillamailblock.com",
  "10minutemail.com", "10minutemail.net", "10minutemail.org",
  "10minemail.com", "10minutemail.de",
  "mailinator.com", "mailinator.net", "mailinator.org",
  "tempmail.com", "tempmail.net", "tempmail.org", "temp-mail.org",
  "throwam.com", "throwam.net",
  "yopmail.com", "yopmail.net", "yopmail.fr",
  "sharklasers.com", "guerrillamailblock.com", "grr.la",
  "trashmail.com", "trashmail.net", "trashmail.me", "trashmail.org",
  "trashmail.at", "trashmail.io",
  "dispostable.com",
  "maildrop.cc",
  "getairmail.com",
  "fakeinbox.com",
  "mailnull.com",
  "spamgourmet.com", "spamgourmet.net",
  "spamevader.com",
  "mailnesia.com",
  "tempr.email",
  "discard.email",
  "filzmail.com",
  "spamfree24.org",
  "spamfree24.de",
  "spamfree24.eu",
  "emailondeck.com",
  "disposablemail.com",
  "throw-am.com",
  "mytemp.email",
  "tempinbox.com",
  "moakt.com",
  "getnada.com",
  "mail-temp.com",
  "tempemail.co",
  "throwaway.email",
  "crazymailing.com",
  "mintemail.com",
  "mt2014.com",
  "mt2015.com",
  "spameater.com",
  "e4ward.com",
  "spamhereplease.com",
  "spaml.com",
  "spaml.de",
  "spammail.me",
  "spam4.me",
  "spamobox.com",
  "notsharingmy.info",
  "binkmail.com",
  "bobmail.info",
  "chammy.info",
  "drdrb.net",
  "put2.net",
  "zetmail.com",
  "zoemail.org",
]);

/** Returns true if the email's domain is a known disposable provider. */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}
