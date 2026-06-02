// ==========================================
// SUSTAIN PLUS — Real company facts
// Source of truth for the marketing site. All values verified from
// the official site (sustainplus-eg.com), LinkedIn, and Facebook.
// Do not invent figures — extend only with verified data.
// ==========================================

export const COMPANY = {
  nameEn: 'Sustain Plus',
  nameAr: 'ساستين بلس',
  // Full registered name (from LinkedIn)
  fullNameEn: 'Sustain Plus for Engineering & Sustainability Consultations',
  fullNameAr: 'ساستين بلس للاستشارات الهندسية والاستدامة',
  taglineEn: 'Leading the Transformation Towards a Sustainable World',
  taglineAr: 'نقود التحول نحو عالم مستدام',

  // Contact (real)
  address:
    '398 El Horreya Road, Abu Qir Main Street, Al-Fanar Tower, Mostafa Kamel Area, 10th Floor, Sidi Gaber, Alexandria',
  addressAr:
    'طريق الحرية ٣٩٨، شارع أبو قير الرئيسي، برج الفنار، منطقة مصطفى كامل، الدور العاشر، سيدي جابر، الإسكندرية',
  email: 'info@sustainplus-eg.com',
  phones: ['+201090021674', '+201099200775'],
  // Dedicated training/registration line (WhatsApp) — from LinkedIn
  trainingPhone: '+201205488444',

  // Social (real)
  facebook: 'https://www.facebook.com/100063765086104',
  linkedin: 'https://www.linkedin.com/company/sustain-plus-consultants',
} as const

// Accreditation (real — announced on LinkedIn)
export const CREDENTIALS = {
  en: 'Accredited training, qualification & consultancy centre — licensed by the National Quality Institute (NQI) and the Egyptian Organization for Standardization (EOS).',
  ar: 'مركز تدريب وتأهيل واستشارات معتمد — مرخّص من المعهد القومي للجودة (NQI) والهيئة المصرية العامة للمواصفات والجودة (EOS).',
} as const

// Vision / Mission / Values (real, from /about-us)
export const ABOUT = {
  whoWeAreEn:
    'Sustain Plus is a leading environmental and engineering company dedicated to supporting sustainable communities. We align our projects with the UN Sustainable Development Goals (SDGs) to design and deliver high-impact water and environmental infrastructure solutions.',
  whoWeAreAr:
    'ساستين بلس شركة بيئية وهندسية رائدة مكرّسة لدعم المجتمعات المستدامة. نوائم مشاريعنا مع أهداف التنمية المستدامة للأمم المتحدة لتصميم وتنفيذ حلول بنية تحتية مائية وبيئية عالية الأثر.',
  visionEn:
    'Leading the transformation towards a sustainable world by empowering industries with innovative green solutions.',
  visionAr:
    'قيادة التحول نحو عالم مستدام عبر تمكين الصناعات بحلول خضراء مبتكرة.',
  missionEn:
    'To provide comprehensive engineering, consulting, and capacity-building services that ensure compliance, efficiency, and positive environmental impact.',
  missionAr:
    'تقديم خدمات هندسية واستشارية وبناء قدرات متكاملة تضمن الامتثال والكفاءة والأثر البيئي الإيجابي.',
  values: [
    {
      icon: 'fa-handshake-angle',
      en: { title: 'Integrity', desc: 'Upholding the highest ethical standards in all our partnerships.' },
      ar: { title: 'النزاهة', desc: 'الالتزام بأعلى المعايير الأخلاقية في كل شراكاتنا.' },
    },
    {
      icon: 'fa-lightbulb',
      en: { title: 'Innovation', desc: 'Adopting cutting-edge technologies like ROO desalination and Blue Ethanol.' },
      ar: { title: 'الابتكار', desc: 'تبنّي أحدث التقنيات مثل تحلية ROO وإنتاج البلو إيثانول.' },
    },
    {
      icon: 'fa-earth-africa',
      en: { title: 'Sustainability', desc: 'Commitment to the UN SDGs in every project we undertake.' },
      ar: { title: 'الاستدامة', desc: 'الالتزام بأهداف التنمية المستدامة في كل مشروع ننفذه.' },
    },
  ],
} as const

// Headline stats (real, from the engineering & water infrastructure capabilities)
export const STATS = [
  { icon: 'fa-briefcase', value: '50+', en: 'Projects completed', ar: 'مشروع مُنجز' },
  { icon: 'fa-earth-africa', value: '5+', en: 'Countries served', ar: 'دول نخدمها' },
  { icon: 'fa-droplet', value: '1,100', en: 'm³/day water desalinated', ar: 'م³/يوم مياه محلّاة' },
  { icon: 'fa-bolt', value: '1.5 MW', en: 'Clean energy generated', ar: 'طاقة نظيفة مولّدة' },
] as const
