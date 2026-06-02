// ==========================================
// SUSTAIN PLUS — Services data (EN / AR)
// Bilingual content for the 4 core service areas and their detail pages.
// Every concrete claim (capacity, %, client, ranking) is a verified company
// fact. Do not invent figures — extend only with verified data.
// ==========================================

export interface Highlight {
  en: string
  ar: string
}

export interface Capability {
  icon: string
  en: { title: string; desc: string }
  ar: { title: string; desc: string }
  highlights?: Highlight[]
}

export interface ProcessStep {
  icon: string
  en: { title: string; desc: string }
  ar: { title: string; desc: string }
}

export interface Metric {
  value: string
  en: string
  ar: string
}

export interface ServiceLocaleContent {
  title: string
  summary: string
  intro: string
}

export interface ServiceEntry {
  icon: string
  /** Short bullets shown on the listing card. */
  cardBullets: { en: string; ar: string }[]
  en: ServiceLocaleContent
  ar: ServiceLocaleContent
  capabilities: Capability[]
  process?: ProcessStep[]
  metrics?: Metric[]
}

export const SERVICES_DATA: Record<string, ServiceEntry> = {
  // ────────────────────────────────────────────────────────────
  'environmental-consulting': {
    icon: 'fa-leaf',
    cardBullets: [
      { en: 'Carbon footprint & decarbonization strategy', ar: 'البصمة الكربونية واستراتيجية خفض الكربون' },
      { en: 'LCA & EPD certification', ar: 'تقييم دورة الحياة واعتماد EPD' },
      { en: 'GRI sustainability reporting', ar: 'تقارير الاستدامة وفق GRI' },
      { en: 'Waste management plans', ar: 'خطط إدارة النفايات' },
    ],
    en: {
      title: 'Environmental Consulting & Studies',
      summary:
        'Data-driven environmental strategies that ensure compliance, cut impact, and lift your sustainability rankings.',
      intro:
        'We help organizations navigate complex environmental challenges with data-driven strategies. From quantifying your carbon footprint to certifying your products, our consulting work is built to ensure regulatory compliance, reduce environmental impact, and boost your sustainability rankings on the metrics that matter to investors, regulators, and customers.',
    },
    ar: {
      title: 'الاستشارات والدراسات البيئية',
      summary:
        'استراتيجيات بيئية قائمة على البيانات تضمن الامتثال وتقلّل الأثر وترفع تصنيفات الاستدامة لديك.',
      intro:
        'نساعد المؤسسات على تجاوز التحديات البيئية المعقّدة عبر استراتيجيات قائمة على البيانات. من قياس البصمة الكربونية إلى اعتماد منتجاتك، تُبنى أعمالنا الاستشارية لضمان الامتثال التنظيمي، وخفض الأثر البيئي، ورفع تصنيفات الاستدامة في المؤشرات التي تهمّ المستثمرين والجهات التنظيمية والعملاء.',
    },
    capabilities: [
      {
        icon: 'fa-cloud',
        en: {
          title: 'Carbon Footprint & Decarbonization',
          desc: 'Comprehensive greenhouse-gas accounting paired with a practical decarbonization strategy that prioritizes the highest-impact reduction levers.',
        },
        ar: {
          title: 'البصمة الكربونية وخفض الكربون',
          desc: 'حساب شامل لانبعاثات غازات الاحتباس الحراري مقروناً باستراتيجية عملية لخفض الكربون تُرتّب أدوات الخفض الأعلى أثراً.',
        },
      },
      {
        icon: 'fa-recycle',
        en: {
          title: 'Life Cycle Assessment (LCA) & EPD Certification',
          desc: 'Cradle-to-grave impact studies that quantify environmental performance and support Environmental Product Declaration (EPD) registration.',
        },
        ar: {
          title: 'تقييم دورة الحياة (LCA) واعتماد EPD',
          desc: 'دراسات أثر من المهد إلى اللحد تقيس الأداء البيئي وتدعم تسجيل الإعلان البيئي للمنتج (EPD).',
        },
        highlights: [
          {
            en: 'Delivered the LCA and EPD registration for Ethydco polyethylene products.',
            ar: 'أنجزنا تقييم دورة الحياة وتسجيل EPD لمنتجات البولي إيثيلين لشركة إيثيدكو.',
          },
        ],
      },
      {
        icon: 'fa-file-contract',
        en: {
          title: 'Sustainability Reporting (GRI Standards)',
          desc: 'Credible sustainability disclosure aligned with the GRI Standards, satisfying investors, regulators, and value-chain partners.',
        },
        ar: {
          title: 'تقارير الاستدامة (معايير GRI)',
          desc: 'إفصاح استدامة موثوق متوافق مع معايير GRI، يلبّي متطلبات المستثمرين والجهات التنظيمية وشركاء سلسلة القيمة.',
        },
      },
      {
        icon: 'fa-arrows-spin',
        en: {
          title: 'Waste Management Plans',
          desc: 'Tailored waste-management plans that reduce disposal cost, divert material from landfill, and keep operations compliant.',
        },
        ar: {
          title: 'خطط إدارة النفايات',
          desc: 'خطط إدارة نفايات مصمّمة خصيصاً تخفض تكلفة التخلص، وتحوّل المواد بعيداً عن المدافن، وتُبقي العمليات ممتثلة.',
        },
        highlights: [
          { en: 'Collection & transport contracts for hazardous and non-hazardous waste.', ar: 'عقود جمع ونقل المخلفات الخطرة وغير الخطرة.' },
          { en: 'Preparation of environmental and industrial registers.', ar: 'إعداد السجلات البيئية والصناعية.' },
        ],
      },
    ],
    metrics: [
      { value: '145 → 50', en: "Oman's environmental performance ranking", ar: 'تصنيف الأداء البيئي لسلطنة عُمان' },
      { value: 'LCA + EPD', en: 'Ethydco polyethylene products certified', ar: 'اعتماد منتجات البولي إيثيلين لإيثيدكو' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  'engineering-water-infrastructure': {
    icon: 'fa-water',
    cardBullets: [
      { en: 'SWRO desalination up to 1,100 m³/day per unit', ar: 'تحلية SWRO حتى 1,100 م³/يوم لكل وحدة' },
      { en: 'Biogas cogeneration (CHP) up to 1.5 MW', ar: 'التوليد المشترك للغاز الحيوي حتى 1.5 ميجاوات' },
      { en: 'Waste & recycling complexes — 1,000 tons/day MSW', ar: 'مجمّعات نفايات وتدوير — 1,000 طن/يوم نفايات بلدية' },
      { en: 'End-to-end EPC delivery', ar: 'تنفيذ EPC متكامل من البداية للنهاية' },
    ],
    en: {
      title: 'Engineering & Water Infrastructure',
      summary:
        'End-to-end EPC for high-impact water, energy, and waste infrastructure — from feasibility to commissioning.',
      intro:
        'We deliver end-to-end Engineering, Procurement and Construction (EPC) for high-impact water and environmental infrastructure. Across desalination, biogas energy, and mega waste-management complexes, we take projects from feasibility and design through to procurement, construction, and long-term operation — engineering each system for performance, compliance, and lasting environmental value.',
    },
    ar: {
      title: 'الهندسة والبنية التحتية المائية',
      summary:
        'تنفيذ EPC متكامل لبنية تحتية عالية الأثر في المياه والطاقة والنفايات — من دراسة الجدوى إلى التشغيل.',
      intro:
        'نقدّم خدمات هندسة وتوريد وإنشاء (EPC) متكاملة لبنية تحتية مائية وبيئية عالية الأثر. من التحلية إلى طاقة الغاز الحيوي ومجمّعات إدارة النفايات الكبرى، نأخذ المشاريع من دراسة الجدوى والتصميم وصولاً إلى التوريد والإنشاء والتشغيل طويل الأمد — مع هندسة كل منظومة لتحقيق الأداء والامتثال والقيمة البيئية المستدامة.',
    },
    capabilities: [
      {
        icon: 'fa-droplet',
        en: {
          title: 'Water Solutions',
          desc: 'Seawater Reverse Osmosis (SWRO) desalination engineered with Energy Recovery Devices (ERD), plus industrial wastewater treatment that meets WHO drinking-water standards.',
        },
        ar: {
          title: 'حلول المياه',
          desc: 'تحلية المياه بالتناضح العكسي لمياه البحر (SWRO) مهندَسة بأجهزة استعادة الطاقة (ERD)، إضافة إلى معالجة مياه الصرف الصناعي بما يطابق معايير منظمة الصحة العالمية لمياه الشرب.',
        },
        highlights: [
          { en: 'Up to 1,100 m³/day per unit (executed in Ras El Hekma).', ar: 'حتى 1,100 م³/يوم لكل وحدة (نُفّذت في رأس الحكمة).' },
          { en: 'Reduces specific energy consumption (kWh/m³) by up to 30%.', ar: 'تخفض الاستهلاك النوعي للطاقة (كيلوواط·ساعة/م³) بنسبة تصل إلى 30%.' },
          { en: 'Industrial wastewater treatment with Zero Liquid Discharge (ZLD).', ar: 'معالجة مياه الصرف الصناعي مع التصريف السائل الصفري (ZLD).' },
          { en: 'Meets WHO drinking-water standards.', ar: 'تطابق معايير منظمة الصحة العالمية لمياه الشرب.' },
        ],
      },
      {
        icon: 'fa-bolt',
        en: {
          title: 'Energy & Biogas',
          desc: 'Anaerobic Digestion and Biogas Cogeneration (CHP) that turn organic and agricultural waste into grid electricity, heat, high-quality organic fertilizer, and Blue Fuel.',
        },
        ar: {
          title: 'الطاقة والغاز الحيوي',
          desc: 'الهضم اللاهوائي والتوليد المشترك للغاز الحيوي (CHP) لتحويل النفايات العضوية والزراعية إلى كهرباء للشبكة وحرارة وسماد عضوي عالي الجودة ووقود أزرق (Blue Fuel).',
        },
        highlights: [
          { en: 'Units generating up to 1.5 MW (1,500 kW).', ar: 'وحدات تولّد حتى 1.5 ميجاوات (1,500 كيلوواط).' },
          { en: 'Processes up to 15,000 m³/day of organic & agricultural waste.', ar: 'تعالج حتى 15,000 م³/يوم من النفايات العضوية والزراعية.' },
          { en: 'Outputs grid electricity, heat, and high-quality organic fertilizer.', ar: 'تنتج كهرباء للشبكة وحرارة وسماداً عضوياً عالي الجودة.' },
          { en: 'Blue Fuel production with full EPC from feasibility to commissioning.', ar: 'إنتاج الوقود الأزرق مع تنفيذ EPC كامل من الجدوى إلى التشغيل.' },
        ],
      },
      {
        icon: 'fa-industry',
        en: {
          title: 'Mega Infrastructure',
          desc: 'Integrated waste-management and recycling complexes built and operated under full EPC, with advanced containment for hazardous waste.',
        },
        ar: {
          title: 'البنية التحتية الكبرى',
          desc: 'مجمّعات متكاملة لإدارة النفايات والتدوير تُنشأ وتُشغّل بنظام EPC كامل، مع احتواء متقدّم للنفايات الخطرة.',
        },
        highlights: [
          { en: 'Processes 1,000 tons/day of Municipal Solid Waste (MSW).', ar: 'تعالج 1,000 طن/يوم من النفايات الصلبة البلدية (MSW).' },
          { en: 'Material Recovery Facilities (MRF), sanitary landfills & RDF lines.', ar: 'مرافق استرداد المواد (MRF) ومدافن صحية وخطوط إنتاج RDF.' },
          { en: 'Advanced hazardous-waste containment.', ar: 'احتواء متقدّم للنفايات الخطرة.' },
          { en: 'Full EPC delivery across the complex.', ar: 'تنفيذ EPC كامل عبر المجمّع.' },
        ],
      },
    ],
    process: [
      {
        icon: 'fa-drafting-compass',
        en: { title: 'Feasibility & Design', desc: 'Technical and commercial feasibility, site assessment, and detailed engineering design.' },
        ar: { title: 'الجدوى والتصميم', desc: 'دراسة الجدوى الفنية والتجارية وتقييم الموقع والتصميم الهندسي التفصيلي.' },
      },
      {
        icon: 'fa-truck-ramp-box',
        en: { title: 'Procurement', desc: 'Sourcing and procurement of equipment, materials, and qualified suppliers.' },
        ar: { title: 'التوريد', desc: 'تأمين وتوريد المعدات والمواد والموردين المؤهّلين.' },
      },
      {
        icon: 'fa-helmet-safety',
        en: { title: 'Construction', desc: 'On-site construction, installation, and commissioning of the integrated system.' },
        ar: { title: 'الإنشاء', desc: 'الإنشاء والتركيب والتشغيل التجريبي للمنظومة المتكاملة في الموقع.' },
      },
      {
        icon: 'fa-gears',
        en: { title: 'O&M Services', desc: 'Operation and maintenance to keep the asset performing reliably over its lifetime.' },
        ar: { title: 'خدمات التشغيل والصيانة', desc: 'التشغيل والصيانة للحفاظ على أداء الأصل بموثوقية طوال عمره الافتراضي.' },
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  'mining-exploration': {
    icon: 'fa-mountain',
    cardBullets: [
      { en: 'Exploration studies — desktop & regional', ar: 'دراسات الاستكشاف — مكتبية وإقليمية' },
      { en: 'Remote sensing & GIS target generation', ar: 'الاستشعار عن بُعد ونظم المعلومات الجغرافية' },
      { en: 'Drilling, sampling & modeling', ar: 'الحفر وأخذ العينات والنمذجة' },
      { en: 'Mining development phases', ar: 'مراحل تطوير المناجم' },
    ],
    en: {
      title: 'Mining Exploration & Engineering Consultancy',
      summary:
        'End-to-end mining consultancy across exploration, target generation, field validation, drilling, and development readiness.',
      intro:
        'We provide end-to-end mining consultancy that combines engineering, geological analysis, and remote sensing across the full project lifecycle — from exploration and target generation through field validation, drilling, and development readiness. Our integrated geological approach turns data into technically sound, defensible decisions at every phase.',
    },
    ar: {
      title: 'استشارات استكشاف وهندسة التعدين',
      summary:
        'استشارات تعدين متكاملة عبر الاستكشاف وتوليد الأهداف والتحقق الميداني والحفر والجاهزية للتطوير.',
      intro:
        'نقدّم استشارات تعدين متكاملة تجمع بين الهندسة والتحليل الجيولوجي والاستشعار عن بُعد عبر دورة حياة المشروع كاملة — من الاستكشاف وتوليد الأهداف وصولاً إلى التحقق الميداني والحفر والجاهزية للتطوير. ويحوّل منهجنا الجيولوجي المتكامل البيانات إلى قرارات سليمة فنياً وقابلة للإثبات في كل مرحلة.',
    },
    capabilities: [
      {
        icon: 'fa-magnifying-glass-chart',
        en: {
          title: 'Exploration Studies',
          desc: 'Desktop and regional studies that consolidate geological data to define prospective areas and frame the exploration program.',
        },
        ar: {
          title: 'دراسات الاستكشاف',
          desc: 'دراسات مكتبية وإقليمية تجمع البيانات الجيولوجية لتحديد المناطق الواعدة وتأطير برنامج الاستكشاف.',
        },
      },
      {
        icon: 'fa-satellite',
        en: {
          title: 'Remote Sensing & GIS',
          desc: 'Satellite analysis, terrain interpretation, and alteration mapping that drive precise target generation.',
        },
        ar: {
          title: 'الاستشعار عن بُعد ونظم المعلومات الجغرافية',
          desc: 'تحليل صور الأقمار الصناعية وتفسير التضاريس ورسم خرائط التغيّر الجيولوجي لتوليد أهداف دقيقة.',
        },
        highlights: [
          { en: 'Satellite analysis & terrain interpretation.', ar: 'تحليل صور الأقمار الصناعية وتفسير التضاريس.' },
          { en: 'Alteration mapping & target generation.', ar: 'رسم خرائط التغيّر الجيولوجي وتوليد الأهداف.' },
        ],
      },
      {
        icon: 'fa-helmet-safety',
        en: {
          title: 'Mining Development Phases',
          desc: 'Mine planning, equipment selection, excavation, production optimization, and integrated safety and environmental management.',
        },
        ar: {
          title: 'مراحل تطوير المناجم',
          desc: 'تخطيط المناجم واختيار المعدات والحفر وتحسين الإنتاج والإدارة المتكاملة للسلامة والبيئة.',
        },
        highlights: [
          { en: 'Mine planning & equipment selection.', ar: 'تخطيط المناجم واختيار المعدات.' },
          { en: 'Excavation & production optimization.', ar: 'الحفر وتحسين الإنتاج.' },
          { en: 'Safety & environmental management.', ar: 'إدارة السلامة والبيئة.' },
        ],
      },
    ],
    process: [
      {
        icon: 'fa-book-open',
        en: { title: 'Desktop & Regional Study', desc: 'Compile and interpret existing geological data to define prospective regions.' },
        ar: { title: 'الدراسة المكتبية والإقليمية', desc: 'جمع وتفسير البيانات الجيولوجية القائمة لتحديد المناطق الواعدة.' },
      },
      {
        icon: 'fa-person-hiking',
        en: { title: 'Field Work', desc: 'Ground validation, mapping, and sampling to confirm desktop targets.' },
        ar: { title: 'العمل الميداني', desc: 'التحقق الأرضي ورسم الخرائط وأخذ العينات للتأكد من الأهداف المكتبية.' },
      },
      {
        icon: 'fa-wave-square',
        en: { title: 'Geophysical Surveys', desc: 'Subsurface surveys to refine targets and characterize the geology.' },
        ar: { title: 'المسوحات الجيوفيزيائية', desc: 'مسوحات تحت السطحية لتنقيح الأهداف وتوصيف التركيب الجيولوجي.' },
      },
      {
        icon: 'fa-arrows-down-to-line',
        en: { title: 'Drilling & Sampling', desc: 'Targeted drilling and systematic sampling to test mineralization.' },
        ar: { title: 'الحفر وأخذ العينات', desc: 'حفر موجّه وأخذ عينات منهجي لاختبار التمعدن.' },
      },
      {
        icon: 'fa-cubes',
        en: { title: 'Interpretation & Modeling', desc: 'Geological interpretation and modeling to inform development decisions.' },
        ar: { title: 'التفسير والنمذجة', desc: 'تفسير ونمذجة جيولوجية لدعم قرارات التطوير.' },
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  'permits-training': {
    icon: 'fa-clipboard-check',
    cardBullets: [
      { en: 'Environmental Impact Assessment (EIA) studies', ar: 'دراسات تقييم الأثر البيئي (EIA)' },
      { en: 'Industrial licenses & environmental registers', ar: 'التراخيص الصناعية والسجلات البيئية' },
      { en: 'Capacity-building workshops', ar: 'ورش بناء القدرات' },
      { en: 'HSE training', ar: 'تدريب الصحة والسلامة والبيئة' },
    ],
    en: {
      title: 'Permits, Approvals & Training',
      summary:
        'Legal compliance and capacity building — from EIA studies and licensing to HSE and sustainability training.',
      intro:
        'We combine legal compliance with capacity building so your operations are both authorized and equipped. We secure the studies, licenses, and registers that keep you compliant, and we build internal capability through targeted workshops and Health, Safety & Environment (HSE) training tailored to your teams. As an accredited training and qualification centre licensed by the National Quality Institute (NQI) and EOS, we issue recognized certificates — including our flagship LCA & EPD programme.',
    },
    ar: {
      title: 'التصاريح والموافقات والتدريب',
      summary:
        'الامتثال القانوني وبناء القدرات — من دراسات تقييم الأثر البيئي والتراخيص إلى تدريب الصحة والسلامة والاستدامة.',
      intro:
        'نجمع بين الامتثال القانوني وبناء القدرات لتكون عملياتك مرخّصة ومجهّزة في آنٍ واحد. نؤمّن الدراسات والتراخيص والسجلات التي تُبقيك ممتثلاً، ونبني القدرات الداخلية عبر ورش عمل موجّهة وتدريب في الصحة والسلامة والبيئة (HSE) مصمّم خصيصاً لفِرقك. وبصفتنا مركز تدريب وتأهيل معتمداً مرخّصاً من المعهد القومي للجودة (NQI) والهيئة المصرية العامة للمواصفات والجودة (EOS)، نمنح شهادات معتمدة — بما فيها برنامجنا الرائد في LCA وEPD.',
    },
    capabilities: [
      {
        icon: 'fa-clipboard-list',
        en: {
          title: 'Environmental Impact Assessment (EIA) Studies',
          desc: 'Full EIA studies that identify, quantify, and mitigate the environmental effects of your projects ahead of approval.',
        },
        ar: {
          title: 'دراسات تقييم الأثر البيئي (EIA)',
          desc: 'دراسات تقييم أثر بيئي متكاملة تحدّد الآثار البيئية لمشاريعك وتقيسها وتخفّفها قبل الموافقة.',
        },
      },
      {
        icon: 'fa-file-signature',
        en: {
          title: 'Industrial Licenses & Environmental Registers',
          desc: 'Preparation and management of industrial licenses and environmental registers to keep your facility fully authorized.',
        },
        ar: {
          title: 'التراخيص الصناعية والسجلات البيئية',
          desc: 'إعداد وإدارة التراخيص الصناعية والسجلات البيئية للحفاظ على ترخيص منشأتك بالكامل.',
        },
      },
      {
        icon: 'fa-chalkboard-user',
        en: {
          title: 'Capacity-Building Workshops',
          desc: 'Tailored workshops that build the in-house knowledge your teams need to lead on sustainability and compliance.',
        },
        ar: {
          title: 'ورش بناء القدرات',
          desc: 'ورش عمل مصمّمة خصيصاً تبني المعرفة الداخلية التي تحتاجها فِرقك لقيادة الاستدامة والامتثال.',
        },
        highlights: [
          { en: 'Accredited training & qualification centre — licensed by NQI & EOS.', ar: 'مركز تدريب وتأهيل معتمد — مرخّص من المعهد القومي للجودة (NQI) وEOS.' },
          { en: 'Flagship accredited LCA & EPD course: 3 intensive days, ISO 14040/44, hands-on openLCA.', ar: 'كورس LCA وEPD المعتمد: 3 أيام مكثفة، ISO 14040/44، تطبيق عملي على openLCA.' },
          { en: 'Delivered ADNOC decarbonization & carbon-capture training.', ar: 'قدّمنا تدريب أدنوك في خفض الكربون واحتجاز الكربون.' },
          { en: 'Delivered GSK sustainability-leadership training for MEA managers.', ar: 'قدّمنا تدريب GSK في قيادة الاستدامة لمديري منطقة الشرق الأوسط وأفريقيا.' },
        ],
      },
      {
        icon: 'fa-helmet-safety',
        en: {
          title: 'Health, Safety & Environment (HSE) Training',
          desc: 'Practical HSE training programs that raise safety performance and embed environmental best practice across operations.',
        },
        ar: {
          title: 'تدريب الصحة والسلامة والبيئة (HSE)',
          desc: 'برامج تدريب عملية في الصحة والسلامة والبيئة ترفع أداء السلامة وترسّخ أفضل الممارسات البيئية عبر العمليات.',
        },
      },
    ],
  },
}

/** Ordered listing of services for the index grid. */
export const SERVICES_ORDER = [
  'environmental-consulting',
  'engineering-water-infrastructure',
  'mining-exploration',
  'permits-training',
] as const
