// DEV-ONLY seed: test users (USER/ADMIN/EXPERT) + a ready escalation case.
// Run against a LOCAL dev DB only. Not for production.
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const pw = await bcrypt.hash('Test@12345!', 12)

  // Base seed leaves admin emailVerified=false; verify all admins so they can log in.
  await prisma.user.updateMany({ where: { role: 'ADMIN' }, data: { emailVerified: true } })

  const user = await prisma.user.upsert({
    where: { email: 'user@dev.local' },
    update: { emailVerified: true, isActive: true },
    create: {
      email: 'user@dev.local', nameAr: 'عميل تجريبي', nameEn: 'Test User',
      passwordHash: pw, role: 'USER', emailVerified: true, isActive: true,
      privacyConsent: true, termsAccepted: true,
    },
  })

  const expert = await prisma.user.upsert({
    where: { email: 'expert@dev.local' },
    update: { emailVerified: true, isActive: true, role: 'EXPERT' },
    create: {
      email: 'expert@dev.local', nameAr: 'خبير تجريبي', nameEn: 'Test Expert',
      passwordHash: pw, role: 'EXPERT', emailVerified: true, isActive: true,
      privacyConsent: true, termsAccepted: true,
    },
  })

  await prisma.expert.upsert({
    where: { userId: expert.id },
    update: { specializations: ['waste', 'compliance'], isActive: true, title: 'استشاري بيئي أول' },
    create: {
      userId: expert.id, title: 'استشاري بيئي أول',
      specializations: ['waste', 'compliance'], languages: ['ar', 'en'], isActive: true,
    },
  })

  const freePlan = await prisma.plan.findUnique({ where: { slug: 'free' } })
  if (freePlan) {
    const now = new Date()
    const end = new Date(now)
    end.setMonth(end.getMonth() + 1)
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, planId: freePlan.id, status: 'ACTIVE', currentPeriodStart: now, currentPeriodEnd: end },
    })
  }

  let session = await prisma.chatSession.findFirst({
    where: { userId: user.id, titleAr: 'استشارة تجريبية — نفايات خطرة' },
  })
  if (!session) {
    session = await prisma.chatSession.create({
      data: {
        userId: user.id,
        titleAr: 'استشارة تجريبية — نفايات خطرة',
        messages: {
          create: [
            { role: 'USER', content: 'عندنا مصنع كيماويات ينتج نفايات خطرة، إيه اشتراطات التخلّص الرسمية والتراخيص المطلوبة من جهاز شؤون البيئة؟' },
            { role: 'ASSISTANT', content: 'بشكل عام يلزم فصل النفايات الخطرة وتخزينها بإحكام والتعاقد مع شركات مرخّصة مع سجلات تفصيلية. أمّا إصدار التراخيص والموافقات الرسمية فيحتاج مراجعة متخصص حسب نشاطك.' },
          ],
        },
      },
    })
  }

  const existingCase = await prisma.expertCase.findUnique({ where: { sessionId: session.id } })
  if (!existingCase) {
    await prisma.expertCase.create({
      data: {
        userId: user.id,
        sessionId: session.id,
        descriptionAr: 'عميل لديه مصنع كيماويات ينتج نفايات خطرة ويسأل عن التراخيص واشتراطات التخلّص الرسمية.',
        userNote: 'محتاج رأي رسمي بخصوص ترخيص جهاز شؤون البيئة بأسرع وقت.',
        aiSummaryAr: 'المشكلة: مصنع كيماويات ينتج نفايات خطرة ويستفسر عن التراخيص واشتراطات التخلّص. نصح المساعد بالفصل والتخزين المحكم والتعاقد مع شركات مرخّصة. النقطة المفتوحة: إصدار التراخيص الرسمية يحتاج رأي خبير معتمد.',
        category: 'waste',
        priority: 'high',
        trigger: 'USER_REQUEST',
        status: 'PENDING',
      },
    })
  }

  console.log('DEV_SEED_DONE')
  console.log('USER:   user@dev.local / Test@12345!')
  console.log('EXPERT: expert@dev.local / Test@12345!')
  console.log('ADMIN:  admin@sustainplus-eg.com / Admin@12345!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
