// ==========================================
// SUSTAINPLUS — Marketing site content (EN / AR)
// Bilingual dictionary for the public homepage.
// ==========================================

export type Locale = 'en' | 'ar'

export interface NavItem {
  label: string
  href: string
}

export interface MetricItem {
  icon: string
  value: string
  label: string
}

export interface PillarItem {
  icon: string
  title: string
  desc: string
}

export interface ServiceItem {
  icon: string
  title: string
  meta: string
}

export interface MarketingDict {
  dir: 'ltr' | 'rtl'
  langSwitchLabel: string
  langSwitchHref: string
  nav: NavItem[]
  cta: { consult: string; explore: string }
  hero: {
    title: string
    titleAccent: string
    subtitle: string
    isoBadges: { line1: string; line2: string }[]
    pillars: PillarItem[]
  }
  stats: MetricItem[]
  services: {
    eyebrow: string
    items: ServiceItem[]
    viewAll: string
  }
  caseStudy: {
    eyebrow: string
    tag: string
    title: string
    body: string
    cta: string
  }
  insights: {
    eyebrow: string
    title: string
    items: { tag: string; title: string; date: string; slug: string }[]
  }
  clients: { eyebrow: string }
  contact: {
    title: string
    subtitle: string
    cta: string
  }
  footer: {
    blurb: string
    colServices: string
    colCompany: string
    services: NavItem[]
    company: NavItem[]
    legal: NavItem[]
    rights: string
  }
}

const en: MarketingDict = {
  dir: 'ltr',
  langSwitchLabel: 'AR',
  langSwitchHref: '/ar',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Insights', href: '/insights' },
    { label: 'Clients', href: '/about#clients' },
    { label: 'Contact', href: '/contact' },
  ],
  cta: { consult: 'Get Consultation', explore: 'Explore Services' },
  hero: {
    title: 'Turning Sustainability into Measurable',
    titleAccent: 'Business Value',
    subtitle:
      'We help industries decarbonize, measure environmental impact, and implement ESG strategies for a better future.',
    isoBadges: [
      { line1: 'ISO', line2: '14064-1' },
      { line1: 'GHG', line2: 'Protocol' },
      { line1: 'ISO', line2: '14040/44' },
      { line1: 'ISO', line2: '14001' },
    ],
    pillars: [
      { icon: 'fa-gauge-high', title: 'Measure', desc: 'Accurate carbon accounting' },
      { icon: 'fa-leaf', title: 'Reduce', desc: 'Mitigate emissions and optimize operations' },
      { icon: 'fa-file-lines', title: 'Report', desc: 'ESG & sustainability reporting' },
      { icon: 'fa-circle-check', title: 'Certify', desc: 'Ensure compliance and transparency' },
    ],
  },
  stats: [
    { icon: 'fa-briefcase', value: '50+', label: 'Projects completed' },
    { icon: 'fa-earth-africa', value: '5+', label: 'Countries served' },
    { icon: 'fa-droplet', value: '1,100', label: 'm³/day water desalinated' },
    { icon: 'fa-bolt', value: '1.5 MW', label: 'Clean energy generated' },
  ],
  services: {
    eyebrow: 'Our Services',
    items: [
      { icon: 'fa-cloud', title: 'Carbon Footprint & LCA', meta: 'Accounting, LCA & decarbonization' },
      { icon: 'fa-file-contract', title: 'EPD & ESG Reporting', meta: 'EPD certification & GRI reporting' },
      { icon: 'fa-droplet', title: 'Desalination & Water Treatment', meta: 'SWRO/ROO & ZLD systems' },
      { icon: 'fa-bolt', title: 'Waste-to-Energy & Biogas', meta: 'Biogas cogeneration up to 1.5 MW' },
      { icon: 'fa-mountain-sun', title: 'Mining Exploration & GIS', meta: 'Exploration, remote sensing & drilling' },
      { icon: 'fa-clipboard-check', title: 'EIA, Permits & HSE Training', meta: 'EIA, licenses & capacity building' },
    ],
    viewAll: 'View All Services',
  },
  caseStudy: {
    eyebrow: 'Case Study',
    tag: 'Engineering',
    title: 'Ras El Hekma Desalination Plant',
    body:
      'A 1,100 m³/day SWRO/ROO desalination plant delivering reliable fresh water with around 30% lower energy consumption — supporting sustainable tourism development on Egypt’s North Coast.',
    cta: 'View Case Study',
  },
  insights: {
    eyebrow: 'Insights',
    title: 'Latest from our experts',
    items: [
      {
        tag: 'Water',
        title: 'ROO desalination: cutting the energy cost of fresh water',
        date: 'May 2026',
        slug: 'roo-desalination',
      },
      {
        tag: 'Energy',
        title: 'From organic waste to power: biogas cogeneration',
        date: 'Apr 2026',
        slug: 'biogas-cogeneration',
      },
      {
        tag: 'Regulation',
        title: 'Environmental Impact Assessment in Egypt: a practical guide',
        date: 'Mar 2026',
        slug: 'eia-egypt',
      },
    ],
  },
  clients: { eyebrow: 'Trusted by industry leaders across the region' },
  contact: {
    title: 'Ready to make sustainability measurable?',
    subtitle:
      'Talk to our experts or get an instant environmental consultation powered by AI.',
    cta: 'Get Consultation',
  },
  footer: {
    blurb:
      'Sustain Plus helps industries decarbonize, measure environmental impact, and turn sustainability into measurable business value.',
    colServices: 'Services',
    colCompany: 'Company',
    services: [
      { label: 'Environmental Consulting', href: '/services/environmental-consulting' },
      { label: 'Engineering & Water', href: '/services/engineering-water-infrastructure' },
      { label: 'Mining Exploration', href: '/services/mining-exploration' },
      { label: 'AI Consultation', href: '/platform' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Insights', href: '/insights' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Refund Policy', href: '/refund-policy' },
    ],
    rights: 'All rights reserved.',
  },
}

const ar: MarketingDict = {
  dir: 'rtl',
  langSwitchLabel: 'EN',
  langSwitchHref: '/',
  nav: [
    { label: 'الرئيسية', href: '/ar' },
    { label: 'من نحن', href: '/ar/about' },
    { label: 'خدماتنا', href: '/ar/services' },
    { label: 'دراسات الحالة', href: '/ar/case-studies' },
    { label: 'مقالات', href: '/ar/insights' },
    { label: 'عملاؤنا', href: '/ar/about#clients' },
    { label: 'تواصل', href: '/ar/contact' },
  ],
  cta: { consult: 'احصل على استشارة', explore: 'استكشف الخدمات' },
  hero: {
    title: 'نحوّل الاستدامة إلى قيمة',
    titleAccent: 'تجارية قابلة للقياس',
    subtitle:
      'نساعد الصناعات على خفض الانبعاثات، وقياس الأثر البيئي، وتطبيق استراتيجيات الحوكمة البيئية من أجل مستقبل أفضل.',
    isoBadges: [
      { line1: 'ISO', line2: '14064-1' },
      { line1: 'GHG', line2: 'Protocol' },
      { line1: 'ISO', line2: '14040/44' },
      { line1: 'ISO', line2: '14001' },
    ],
    pillars: [
      { icon: 'fa-gauge-high', title: 'القياس', desc: 'حساب دقيق للبصمة الكربونية' },
      { icon: 'fa-leaf', title: 'الخفض', desc: 'تقليل الانبعاثات وتحسين العمليات' },
      { icon: 'fa-file-lines', title: 'التقارير', desc: 'تقارير الاستدامة والحوكمة البيئية' },
      { icon: 'fa-circle-check', title: 'الاعتماد', desc: 'ضمان الامتثال والشفافية' },
    ],
  },
  stats: [
    { icon: 'fa-briefcase', value: '+50', label: 'مشروع مُنجز' },
    { icon: 'fa-earth-africa', value: '+5', label: 'دول نخدمها' },
    { icon: 'fa-droplet', value: '1,100', label: 'م³/يوم مياه محلّاة' },
    { icon: 'fa-bolt', value: '1.5 MW', label: 'طاقة نظيفة مولّدة' },
  ],
  services: {
    eyebrow: 'خدماتنا',
    items: [
      { icon: 'fa-cloud', title: 'البصمة الكربونية وتقييم دورة الحياة', meta: 'حساب الانبعاثات وLCA وخفض الكربون' },
      { icon: 'fa-file-contract', title: 'شهادات EPD وتقارير ESG', meta: 'شهادات EPD وتقارير GRI' },
      { icon: 'fa-droplet', title: 'التحلية ومعالجة المياه', meta: 'تحلية SWRO/ROO وأنظمة ZLD' },
      { icon: 'fa-bolt', title: 'تحويل النفايات لطاقة وبيوغاز', meta: 'توليد مشترك للبيوغاز حتى 1.5 MW' },
      { icon: 'fa-mountain-sun', title: 'استكشاف التعدين وGIS', meta: 'استكشاف واستشعار عن بُعد وحفر' },
      { icon: 'fa-clipboard-check', title: 'دراسات EIA والتصاريح والتدريب', meta: 'EIA وتراخيص وبناء قدرات' },
    ],
    viewAll: 'عرض كل الخدمات',
  },
  caseStudy: {
    eyebrow: 'دراسة حالة',
    tag: 'هندسة',
    title: 'محطة تحلية رأس الحكمة',
    body:
      'محطة تحلية بطاقة 1,100 م³/يوم بتقنية SWRO/ROO توفّر مياهًا عذبة موثوقة باستهلاك طاقة أقل بنحو 30%، لدعم تنمية سياحية مستدامة على الساحل الشمالي بمصر.',
    cta: 'اقرأ دراسة الحالة',
  },
  insights: {
    eyebrow: 'مقالات',
    title: 'أحدث ما كتبه خبراؤنا',
    items: [
      {
        tag: 'المياه',
        title: 'تحلية ROO: خفض تكلفة طاقة المياه العذبة',
        date: 'مايو 2026',
        slug: 'roo-desalination',
      },
      {
        tag: 'الطاقة',
        title: 'من النفايات العضوية إلى الطاقة: التوليد المشترك للبيوغاز',
        date: 'أبريل 2026',
        slug: 'biogas-cogeneration',
      },
      {
        tag: 'تشريعات',
        title: 'تقييم الأثر البيئي في مصر: دليل عملي',
        date: 'مارس 2026',
        slug: 'eia-egypt',
      },
    ],
  },
  clients: { eyebrow: 'موثوق بنا من كبرى الصناعات في المنطقة' },
  contact: {
    title: 'جاهز تخلّي الاستدامة قابلة للقياس؟',
    subtitle: 'تحدث مع خبرائنا أو احصل على استشارة بيئية فورية مدعومة بالذكاء الاصطناعي.',
    cta: 'احصل على استشارة',
  },
  footer: {
    blurb:
      'ساستين بلس تساعد الصناعات على خفض الانبعاثات وقياس الأثر البيئي وتحويل الاستدامة إلى قيمة تجارية قابلة للقياس.',
    colServices: 'الخدمات',
    colCompany: 'الشركة',
    services: [
      { label: 'الاستشارات البيئية', href: '/ar/services/environmental-consulting' },
      { label: 'الهندسة والمياه', href: '/ar/services/engineering-water-infrastructure' },
      { label: 'استكشاف التعدين', href: '/ar/services/mining-exploration' },
      { label: 'الاستشارة الذكية', href: '/platform' },
    ],
    company: [
      { label: 'من نحن', href: '/ar/about' },
      { label: 'دراسات الحالة', href: '/ar/case-studies' },
      { label: 'مقالات', href: '/ar/insights' },
      { label: 'تواصل', href: '/ar/contact' },
    ],
    legal: [
      { label: 'سياسة الخصوصية', href: '/privacy-policy' },
      { label: 'الشروط والأحكام', href: '/terms' },
      { label: 'سياسة الاسترجاع', href: '/refund-policy' },
    ],
    rights: 'جميع الحقوق محفوظة.',
  },
}

export const MARKETING: Record<Locale, MarketingDict> = { en, ar }
