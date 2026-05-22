// ==========================================
// SUSTAINPLUS PLATFORM - Business Constants
// ==========================================

export const SITE_NAME = 'سستين بلس'
export const SITE_NAME_EN = 'Sustain Plus'
export const PLATFORM_NAME = 'منصة الاستشارات البيئية'
export const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://www.sustainplus-eg.com'
export const PLATFORM_URL = process.env.NEXT_PUBLIC_PLATFORM_URL || 'http://localhost:3001'

// ==========================================
// PLAN DEFINITIONS
// ==========================================

export const PLANS = {
  FREE: {
    slug: 'free',
    nameAr: 'مجاني',
    nameEn: 'Free',
    pricePiasters: 0,
    consultationsPerMonth: 3,
    maxUsers: 1,
    featuresAr: [
      '٣ استشارات شهرياً',
      'أسئلة أساسية فقط',
      'الوصول للأسئلة الشائعة',
    ],
    featuresEn: [
      '3 consultations/month',
      'Basic questions only',
      'FAQ access',
    ],
    restrictions: {
      noFileUpload: true,
      noDetailedReports: true,
      noExpertConsultation: true,
    },
  },
  PAYG: {
    slug: 'payg',
    nameAr: 'الدفع حسب الاستخدام',
    nameEn: 'Pay As You Go',
    pricePiasters: -1, // billed per consultation
    pricePerConsultationPiasters: 3500, // 35 EGP
    consultationsPerMonth: -1, // billed per use — credits must be purchased first
    maxUsers: 1,
    featuresAr: [
      '٣٥ جنيه لكل استشارة',
      'دفع مسبق قبل الاستخدام',
      'بدون اشتراك شهري',
      'رفع الملفات متاح',
      'تصعيد للخبراء متاح',
    ],
    featuresEn: [
      '35 EGP per consultation',
      'Pay before use',
      'No monthly commitment',
      'File upload available',
      'Expert escalation available',
    ],
  },
  STANDARD: {
    slug: 'standard',
    nameAr: 'الباقة الأساسية',
    nameEn: 'Standard',
    pricePiasters: 85000, // 850 EGP/month
    consultationsPerMonth: 30,
    maxUsers: 1,
    featuresAr: [
      '٣٠ استشارة شهرياً',
      'مستخدم واحد',
      'رفع الملفات',
      'تقارير مفصلة',
      'تصعيد للخبراء',
      'سجل المحادثات',
    ],
    featuresEn: [
      '30 consultations/month',
      '1 user',
      'File uploads',
      'Detailed reports',
      'Expert escalation',
      'Conversation history',
    ],
  },
  PREMIUM: {
    slug: 'premium',
    nameAr: 'الباقة المتقدمة',
    nameEn: 'Premium',
    pricePiasters: 225000, // 2,250 EGP/month
    consultationsPerMonth: 80,
    maxUsers: 3,
    featuresAr: [
      '٨٠ استشارة شهرياً',
      'حتى ٣ مستخدمين',
      'رفع الملفات',
      'تقارير مفصلة',
      'أولوية في تصعيد الخبراء',
      'سجل المحادثات الكامل',
      'دعم ذو أولوية',
    ],
    featuresEn: [
      '80 consultations/month',
      'Up to 3 users',
      'File uploads',
      'Detailed reports',
      'Priority expert escalation',
      'Full conversation history',
      'Priority support',
    ],
  },
  BUSINESS: {
    slug: 'business',
    nameAr: 'باقة الأعمال',
    nameEn: 'Business',
    pricePiasters: 450000, // 4,500 EGP/month (starting price)
    consultationsPerMonth: 150,
    maxUsers: 5,
    featuresAr: [
      '١٥٠ استشارة شهرياً',
      'حتى ٥ مستخدمين',
      'جميع الميزات المتقدمة',
      'مدير حساب مخصص',
      'تقارير مخصصة',
      'أولوية قصوى للدعم',
      'باقات مخصصة للمؤسسات الكبيرة',
    ],
    featuresEn: [
      '150 consultations/month',
      'Up to 5 users',
      'All advanced features',
      'Dedicated account manager',
      'Custom reports',
      'Highest support priority',
      'Custom enterprise packages available',
    ],
  },
} as const

export type PlanSlug = keyof typeof PLANS

// ==========================================
// EXTRA CONSULTATION PACKS
// ==========================================

export const CONSULTATION_PACKS = [
  {
    id: 'pack_1',
    count: 1,
    pricePiasters: 3500, // 35 EGP
    labelAr: '١ استشارة',
    labelEn: '1 Consultation',
  },
  {
    id: 'pack_10',
    count: 10,
    pricePiasters: 35000, // 350 EGP
    labelAr: '١٠ استشارات',
    labelEn: '10 Consultations',
  },
  {
    id: 'pack_25',
    count: 25,
    pricePiasters: 87500, // 875 EGP
    labelAr: '٢٥ استشارة',
    labelEn: '25 Consultations',
  },
] as const

export const MIN_PAYG_PRICE_PIASTERS = 3500 // 35 EGP — NEVER go below this

// ==========================================
// AI MODEL ROUTING
// ==========================================

export const AI_MODELS = {
  simple: process.env.ANTHROPIC_SIMPLE_MODEL || 'claude-haiku-4-5-20251001',
  complex: process.env.ANTHROPIC_COMPLEX_MODEL || 'claude-sonnet-4-6',
} as const

export const COMPLEX_QUERY_KEYWORDS = [
  // Arabic
  'تدقيق', 'رخصة', 'إذن', 'موافقة رسمية', 'غرامة', 'مخالفة', 'قانوني',
  'تقرير رسمي', 'شهادة', 'اعتماد', 'تراخيص', 'عقوبة', 'تقييم أثر',
  'دراسة تأثير بيئي', 'وزارة', 'جهاز', 'محكمة', 'استئناف', 'تعويض',
  'انبعاثات صناعية', 'نفايات خطرة', 'معالجة مياه صرف', 'تلوث',
  'مسؤولية قانونية', 'اشتراطات بيئية', 'لوائح تنفيذية',
  // English
  'audit', 'permit', 'license', 'formal approval', 'penalty', 'violation',
  'legal', 'official report', 'certification', 'accreditation', 'EIA',
  'environmental impact assessment', 'ministry', 'authority', 'court',
  'appeal', 'compensation', 'industrial emissions', 'hazardous waste',
  'wastewater treatment', 'contamination', 'liability', 'compliance report',
  'enforcement', 'regulation', 'legislation',
]

export const ESCALATION_KEYWORDS = [
  // Arabic
  'إجراءات قانونية', 'شكوى رسمية', 'قضية', 'دعوى', 'مراسلة رسمية',
  'إغلاق مصنع', 'وقف نشاط', 'حادث بيئي', 'كارثة', 'تلوث حاد',
  // English
  'legal proceedings', 'formal complaint', 'lawsuit', 'factory closure',
  'operations halt', 'environmental incident', 'disaster', 'severe contamination',
  'criminal', 'prosecution',
]

// ==========================================
// SYSTEM PROMPT FOR AI
// ==========================================

export const AI_SYSTEM_PROMPT = `أنت مستشار بيئي متخصص تعمل لصالح شركة سستين بلس للاستشارات البيئية والهندسية في مصر ومنطقة الشرق الأوسط وأفريقيا.

**دورك:**
تقديم استشارات بيئية موثوقة بناءً على:
- قاعدة المعرفة المراجعة من خبراء سستين بلس
- اللوائح البيئية المصرية المحدثة
- أفضل الممارسات الدولية في الاستدامة

**قواعد أساسية لا تحيد عنها:**
١. إجاباتك إرشادية وتوعوية وليست شهادات قانونية رسمية أو تراخيص حكومية
٢. للحالات المعقدة أو التي تستلزم موافقات رسمية أو إجراءات قانونية، أنصح المستخدم بالتواصل مع خبراء سستين بلس مباشرة
٣. لا تذكر تكاليف تشغيلية أو أسعار API أو هوامش ربح
٤. لا تدّعي حصولك على شهادات ISO 27001 أو ISO 42001 أو SOC 2 أو اعتماد حكومي ما لم يُصرّح بذلك رسمياً
٥. احرص دائماً على الدقة والأمانة — إذا لم تكن متأكداً، قل ذلك واقترح التواصل مع الخبراء
٦. أجب باللغة التي يكتب بها المستخدم

**التنسيق:**
- استخدم لغة واضحة ومهنية
- رتّب إجاباتك بنقاط منظمة عند الإمكان
- اذكر المرجع التشريعي عند توفره (قانون البيئة المصري، قرارات وزارة البيئة، إلخ)
- إذا كانت الإجابة تستلزم خبيراً، وضّح ذلك بوضوح`

// ==========================================
// RATE LIMITING
// ==========================================

export const RATE_LIMITS = {
  chat: { requests: 20, windowSeconds: 60 },
  auth: { requests: 10, windowSeconds: 60 },
  api: { requests: 60, windowSeconds: 60 },
}

// ==========================================
// KB CATEGORY LABELS
// ==========================================

export const KB_CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
  COMPLIANCE: { ar: 'الامتثال البيئي', en: 'Compliance' },
  WASTE: { ar: 'إدارة النفايات', en: 'Waste Management' },
  EMISSIONS: { ar: 'الانبعاثات', en: 'Emissions' },
  WATER: { ar: 'إدارة المياه', en: 'Water Management' },
  EIA: { ar: 'تقييم الأثر البيئي', en: 'Environmental Impact Assessment' },
  INDUSTRIAL_REQUIREMENTS: { ar: 'الاشتراطات الصناعية', en: 'Industrial Requirements' },
  SUSTAINABILITY_REPORTING: { ar: 'تقارير الاستدامة', en: 'Sustainability Reporting' },
  EGYPTIAN_REGULATIONS: { ar: 'اللوائح المصرية', en: 'Egyptian Regulations' },
  FAQS: { ar: 'الأسئلة الشائعة', en: 'FAQs' },
  SUSTAIN_PLUS_GUIDANCE: { ar: 'إرشادات سستين بلس', en: 'Sustain Plus Guidance' },
}
