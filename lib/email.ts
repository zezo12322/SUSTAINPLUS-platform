import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = process.env.EMAIL_FROM || 'ساستين بلس <noreply@sustainplus-eg.com>'
const DEV = process.env.NODE_ENV !== 'production'

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    if (DEV) console.log(`[EMAIL DEV] To: ${to}\nSubject: ${subject}\n${html.replace(/<[^>]+>/g, '')}`)
    return
  }
  await resend.emails.send({ from: FROM, to, subject, html })
}

export async function sendVerificationEmail(to: string, name: string, code: string) {
  await send(
    to,
    'تأكيد بريدك الإلكتروني — ساستين بلس',
    `<div dir="rtl" style="font-family:Arial;max-width:500px;margin:auto">
      <h2>مرحباً ${name}،</h2>
      <p>أدخل الكود التالي لتأكيد حسابك:</p>
      <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#16a34a;text-align:center;padding:20px;background:#f0fdf4;border-radius:8px">${code}</div>
      <p style="color:#6b7280">الكود صالح لمدة 15 دقيقة.</p>
    </div>`
  )
}

export async function sendPasswordResetEmail(to: string, name: string, code: string) {
  await send(
    to,
    'إعادة تعيين كلمة المرور — ساستين بلس',
    `<div dir="rtl" style="font-family:Arial;max-width:500px;margin:auto">
      <h2>مرحباً ${name}،</h2>
      <p>استخدم هذا الكود لإعادة تعيين كلمة المرور:</p>
      <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#dc2626;text-align:center;padding:20px;background:#fef2f2;border-radius:8px">${code}</div>
      <p style="color:#6b7280">الكود صالح لمدة 15 دقيقة. إذا لم تطلب هذا، تجاهل الرسالة.</p>
    </div>`
  )
}

export async function sendTwoFactorEmail(to: string, name: string, code: string) {
  await send(
    to,
    'رمز التحقق الثنائي — ساستين بلس',
    `<div dir="rtl" style="font-family:Arial;max-width:500px;margin:auto">
      <h2>مرحباً ${name}،</h2>
      <p>رمز التحقق الثنائي لتسجيل الدخول:</p>
      <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#2563eb;text-align:center;padding:20px;background:#eff6ff;border-radius:8px">${code}</div>
      <p style="color:#6b7280">الكود صالح لمدة 15 دقيقة.</p>
    </div>`
  )
}

export async function sendLoginNotificationEmail(to: string, name: string, ip: string, time: string) {
  await send(
    to,
    'تسجيل دخول جديد — ساستين بلس',
    `<div dir="rtl" style="font-family:Arial;max-width:500px;margin:auto">
      <h2>مرحباً ${name}،</h2>
      <p>تم تسجيل الدخول لحسابك للتو:</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px;color:#6b7280">الوقت</td><td style="padding:8px">${time}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px;color:#6b7280">عنوان IP</td><td style="padding:8px">${ip}</td></tr>
      </table>
      <p style="color:#dc2626">إذا لم تكن أنت، قم بتغيير كلمة المرور فوراً.</p>
    </div>`
  )
}
