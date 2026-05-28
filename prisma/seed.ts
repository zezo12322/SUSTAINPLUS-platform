import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ==========================================
  // PLANS
  // ==========================================
  const plansData = [
    {
      slug: 'free',
      nameAr: 'مجاني',
      nameEn: 'Free',
      pricePiasters: 0,
      consultationsPerMonth: 3,
      maxUsers: 1,
      featuresAr: ['٣ استشارات شهرياً', 'أسئلة أساسية فقط', 'الوصول للأسئلة الشائعة'],
      featuresEn: ['3 consultations/month', 'Basic questions only', 'FAQ access'],
      sortOrder: 1,
    },
    {
      slug: 'payg',
      nameAr: 'الدفع حسب الاستخدام',
      nameEn: 'Pay As You Go',
      pricePiasters: -1,
      consultationsPerMonth: -1,
      maxUsers: 1,
      featuresAr: ['٣٥ جنيه لكل استشارة', 'دفع مسبق', 'بدون اشتراك'],
      featuresEn: ['35 EGP per consultation', 'Pay before use', 'No commitment'],
      sortOrder: 2,
    },
    {
      slug: 'standard',
      nameAr: 'الباقة الأساسية',
      nameEn: 'Standard',
      pricePiasters: 85000,
      consultationsPerMonth: 30,
      maxUsers: 1,
      featuresAr: ['٣٠ استشارة شهرياً', 'مستخدم واحد', 'رفع الملفات', 'تقارير مفصلة'],
      featuresEn: ['30 consultations/month', '1 user', 'File uploads', 'Detailed reports'],
      sortOrder: 3,
    },
    {
      slug: 'premium',
      nameAr: 'الباقة المتقدمة',
      nameEn: 'Premium',
      pricePiasters: 225000,
      consultationsPerMonth: 80,
      maxUsers: 3,
      featuresAr: ['٨٠ استشارة شهرياً', 'حتى ٣ مستخدمين', 'جميع الميزات', 'دعم ذو أولوية'],
      featuresEn: ['80 consultations/month', 'Up to 3 users', 'All features', 'Priority support'],
      sortOrder: 4,
    },
    {
      slug: 'business',
      nameAr: 'باقة الأعمال',
      nameEn: 'Business',
      pricePiasters: 450000,
      consultationsPerMonth: 150,
      maxUsers: 5,
      featuresAr: ['١٥٠ استشارة شهرياً', 'حتى ٥ مستخدمين', 'مدير حساب مخصص'],
      featuresEn: ['150 consultations/month', 'Up to 5 users', 'Dedicated account manager'],
      sortOrder: 5,
    },
  ]

  for (const plan of plansData) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    })
  }
  console.log('✅ Plans seeded')

  // ==========================================
  // ADMIN USER
  // ==========================================
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sustainplus-eg.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345!'
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      nameAr: 'مدير المنصة',
      nameEn: 'Platform Admin',
      passwordHash,
      role: 'ADMIN',
      isActive: true,
      privacyConsent: true,
      termsAccepted: true,
    },
  })
  console.log(`✅ Admin user: ${admin.email}`)

  // ==========================================
  // SAMPLE KNOWLEDGE BASE ENTRIES
  // ==========================================
  const kbEntries = [
    {
      titleAr: 'متطلبات الترخيص البيئي للمنشآت الصناعية في مصر',
      category: 'COMPLIANCE' as const,
      contentAr: `تلتزم المنشآت الصناعية في مصر بالحصول على الموافقة البيئية قبل بدء التشغيل وفقاً لقانون البيئة رقم ٤ لسنة ١٩٩٤ وتعديلاته.

**المتطلبات الأساسية:**
١. تقديم طلب الترخيص البيئي لجهاز شؤون البيئة (EEAA)
٢. إعداد دراسة تقييم الأثر البيئي (EIA) للمشاريع الكبيرة
٣. الحصول على موافقة بيئية مسبقة قبل بدء التشغيل
٤. الالتزام بالحدود المسموح بها للانبعاثات والنفايات

**المستندات المطلوبة:**
- رسم تخطيطي للموقع
- وصف العمليات الإنتاجية
- خطة إدارة النفايات
- خطة الطوارئ البيئية

**ملاحظة:** تختلف المتطلبات حسب نوع النشاط الصناعي والحجم.`,
      status: 'PUBLISHED' as const,
      reviewer: 'فريق ساستين بلس',
      tags: ['ترخيص', 'امتثال', 'EEAA', 'صناعة'],
      sourceNotes: 'قانون البيئة رقم ٤ لسنة ١٩٩٤ وتعديلاته - قرار وزير البيئة',
      createdBy: admin.id,
    },
    {
      titleAr: 'معايير إدارة النفايات الصناعية الخطرة',
      category: 'WASTE' as const,
      contentAr: `تخضع النفايات الصناعية الخطرة لأحكام قانون البيئة المصري واشتراطات جهاز شؤون البيئة.

**تعريف النفايات الخطرة:**
النفايات التي تتضمن مواد قابلة للاشتعال، أو سامة، أو مسببة للتآكل، أو معدية، أو مشعة.

**اشتراطات التخلص:**
١. الفصل الكامل بين النفايات الخطرة والمخلفات العادية
٢. التخزين في حاويات مُعلَّمة ومحكمة الإغلاق
٣. الترحيل مع شركات مرخصة من جهاز شؤون البيئة
٤. الاحتفاظ بسجلات تفصيلية لكميات ومصادر النفايات

**العقوبات:**
التخلص غير القانوني من النفايات الخطرة يستوجب غرامات وعقوبات جنائية وفق المادة ٩٤ من قانون البيئة.`,
      status: 'PUBLISHED' as const,
      reviewer: 'فريق ساستين بلس',
      tags: ['نفايات خطرة', 'إدارة النفايات', 'امتثال'],
      sourceNotes: 'قانون البيئة رقم ٤ لسنة ١٩٩٤ - الباب الخامس',
      createdBy: admin.id,
    },
    {
      titleAr: 'الأسئلة الشائعة: دراسة تقييم الأثر البيئي (EIA)',
      category: 'EIA' as const,
      contentAr: `**ما هي دراسة تقييم الأثر البيئي؟**
دراسة EIA هي تقييم منهجي للآثار البيئية المحتملة لمشروع قبل البدء في تنفيذه، وذلك للتعرف على الآثار السلبية والإيجابية واتخاذ قرارات مدروسة.

**متى تكون دراسة EIA إلزامية؟**
- المشاريع الصناعية الكبيرة
- محطات توليد الطاقة
- مشاريع البنية التحتية (طرق، موانئ، مطارات)
- المصانع الكيماوية
- مشاريع استخراج المواد الخام

**مراحل إعداد دراسة EIA:**
١. الفرز البيئي (Screening)
٢. تحديد نطاق الدراسة (Scoping)
٣. جمع البيانات الأساسية
٤. تحليل الآثار البيئية
٥. خطة الإدارة البيئية
٦. إشراك أصحاب المصلحة

**المراجعة والاعتماد:**
تُراجع الدراسة من قِبل جهاز شؤون البيئة (EEAA) قبل منح الموافقة البيئية.`,
      status: 'PUBLISHED' as const,
      reviewer: 'فريق ساستين بلس',
      tags: ['EIA', 'تقييم أثر بيئي', 'أسئلة شائعة'],
      sourceNotes: 'اللائحة التنفيذية لقانون البيئة - قرار وزير البيئة رقم ٣٣٨ لسنة ١٩٩٥',
      createdBy: admin.id,
    },
    {
      titleAr: 'حدود انبعاثات الهواء المسموح بها للمنشآت الصناعية',
      category: 'EMISSIONS' as const,
      contentAr: `تحدد اللائحة التنفيذية لقانون البيئة المصري الحدود القصوى المسموح بها لانبعاثات الهواء من المصادر الثابتة.

**الملوثات الرئيسية المنظَّمة:**
- ثاني أكسيد الكبريت (SO₂): ٢٠٠٠ ملغم/م³ للمداخن الصناعية
- أكاسيد النيتروجين (NOx): ١٥٠٠ ملغم/م³
- الجسيمات العالقة (PM): ١٥٠ ملغم/م³ (أقل للصناعات الكيماوية)
- أول أكسيد الكربون (CO): ٦٥٠ ملغم/م³

**الرصد والقياس:**
تلتزم المنشآت الصناعية بإجراء قياسات دورية للانبعاثات لا تقل عن مرة كل ٣ أشهر، وتقديم تقارير لجهاز شؤون البيئة.

**الإجراءات عند تجاوز الحدود:**
تقديم خطة تصحيحية (Action Plan) خلال ٣٠ يوماً، وإلا تُطبق الغرامات المنصوص عليها في القانون.`,
      status: 'PUBLISHED' as const,
      reviewer: 'فريق ساستين بلس',
      tags: ['انبعاثات', 'هواء', 'حدود مسموح', 'رصد'],
      sourceNotes: 'قرار وزير البيئة رقم ٥٢١ لسنة ١٩٩٥',
      createdBy: admin.id,
    },
    {
      titleAr: 'اشتراطات معالجة مياه الصرف الصناعي',
      category: 'WATER' as const,
      contentAr: `تلتزم المنشآت الصناعية بمعالجة مياه الصرف قبل تصريفها وفق المعايير المحددة.

**المعايير الأساسية للصرف في الصرف الصحي العام:**
- pH: ٦ - ٩
- BOD: ٤٠٠ ملغم/لتر كحد أقصى
- COD: ٨٠٠ ملغم/لتر
- المواد الصلبة العالقة: ٢٠٠ ملغم/لتر

**المعايير للصرف في المسطحات المائية:**
أكثر صرامة بكثير — يُرجى الرجوع لقرار وزير البيئة رقم ٤٤ لسنة ٢٠٠٠.

**المتطلبات التشغيلية:**
١. وجود محطة معالجة مياه الصرف (WWTP) معتمدة
٢. مراقبة يومية لجودة المياه المعالجة
٣. سجلات تفصيلية للقياسات
٤. تصاريح تصريف من الجهات المختصة`,
      status: 'PUBLISHED' as const,
      reviewer: 'فريق ساستين بلس',
      tags: ['مياه', 'صرف صناعي', 'معالجة', 'BOD', 'COD'],
      sourceNotes: 'قرار وزير البيئة رقم ٤٤ لسنة ٢٠٠٠',
      createdBy: admin.id,
    },
  ]

  for (const entry of kbEntries) {
    const existing = await prisma.knowledgeEntry.findFirst({
      where: { titleAr: entry.titleAr },
    })
    if (!existing) {
      await prisma.knowledgeEntry.create({ data: entry })
    }
  }
  console.log(`✅ ${kbEntries.length} knowledge base entries seeded`)

  console.log('\n🎉 Seed complete!')
  console.log(`\nAdmin credentials:`)
  console.log(`  Email: ${adminEmail}`)
  console.log(`  Password: ${adminPassword}`)
  console.log('\n⚠️  Change the admin password immediately after first login!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
