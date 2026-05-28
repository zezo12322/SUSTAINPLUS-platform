const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.info', 'grr.la',
  'sharklasers.com', 'spam4.me', 'trashmail.com', 'trashmail.me', 'trashmail.net',
  'maildrop.cc', 'fakeinbox.com', 'temp-mail.org', 'tempmail.com', 'tempr.email',
  'throwaway.email', 'throwam.com', 'throwamailaway.com', 'dispostable.com',
  'yopmail.com', 'yopmail.fr', 'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc',
  '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minutemail.de',
  'minutemail.com', 'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
  'mailnull.com', 'spamfree24.org', 'discard.email', 'mailnesia.com',
  'tempinbox.com', 'mailexpire.com', 'getairmail.com', 'filzmail.com',
  'dropmail.me', 'cmail.club', 'getonemail.com', 'meltmail.com',
  'incognitomail.com', 'e4ward.com', 'spamhereplease.com', 'spamthisplease.com',
  'spamherelots.com', 'trash-mail.com', 'mailnew.com', 'tempomail.fr',
  'mytrashmail.com', 'mailnull.com', 'safetymail.info', 'deadaddress.com',
  'trashdevil.com', 'spammotel.com', 'spam.la', 'getonemail.com',
  'mailbolt.com', 'mailc.net', 'mailcat.biz', 'mailchop.com', 'mailcker.com',
  'maildu.de', 'maileater.com', 'maileme101.com', 'mailforspam.com',
  'mailin8r.com', 'mailinater.com', 'mailismagic.com', 'mailme24.com',
  'mailnew.com', 'mailnull.com', 'mailpick.biz', 'mailrock.biz', 'mailscrap.com',
  'mailshell.com', 'mailsiphon.com', 'mailslite.com', 'mailsucker.net',
  'mailtemp.org', 'mailtothis.com', 'mailzilla.com', 'mailzilla.org',
  'spamfree.eu', 'fakemailgenerator.com', 'temporaryinbox.com',
  'throwam.com', 'fakemailz.com', 'ano-mail.net', 'antispam24.de',
])

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false
  return DISPOSABLE_DOMAINS.has(domain)
}
