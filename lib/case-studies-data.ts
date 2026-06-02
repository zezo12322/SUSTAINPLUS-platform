// ==========================================
// SUSTAIN PLUS — Case studies (EN / AR)
// Real, verified projects only. Do NOT invent clients, numbers,
// certifications, or results beyond what is recorded here.
// Source of truth for the /case-studies listing and detail pages.
// ==========================================

import { type Locale } from '@/lib/marketing'

export type CaseCategory = 'Consulting' | 'Engineering' | 'Training'

export interface CaseFact {
  /** FontAwesome 6 solid icon name, e.g. 'fa-water'. */
  icon: string
  label: string
  value: string
}

export interface CaseSection {
  heading: string
  /** One or more paragraphs of connective prose. */
  paragraphs: string[]
}

export interface CaseLocaleContent {
  /** Localized category label shown on chips and the banner eyebrow. */
  category: string
  /** Project title. */
  title: string
  /** The real one-line summary. */
  summary: string
  /** Short banner subtitle (a lead-in expanding the summary). */
  subtitle: string
  overview: CaseSection
  approach: CaseSection
  outcome: CaseSection
  /** Only real, verified facts. */
  facts: CaseFact[]
}

export interface CaseStudy {
  /** Language-neutral category, used for grouping/logic. */
  category: CaseCategory
  /** FontAwesome 6 solid icon for the project. */
  icon: string
  /** Brand gradient used as a navy overlay over the project photo. */
  gradient: string
  /** Project photo, served from /public. Path: /images/projects/<slug>.jpg */
  image: string
  en: CaseLocaleContent
  ar: CaseLocaleContent
}

const GRAD = {
  policy: 'linear-gradient(135deg, #0A1626 0%, #16335C 55%, #2E5A93 100%)',
  water: 'linear-gradient(135deg, #0C1D32 0%, #16335C 60%, #2E5A93 100%)',
  fuel: 'linear-gradient(135deg, #0A1626 0%, #1F4A7A 70%, #2E5A93 100%)',
  lca: 'linear-gradient(135deg, #0C1D32 0%, #1F4A7A 55%, #3A6BA5 100%)',
  carbon: 'linear-gradient(135deg, #0A1626 0%, #16335C 50%, #1F4A7A 100%)',
  training: 'linear-gradient(135deg, #0C1D32 0%, #1F4A7A 60%, #2E5A93 100%)',
}

export const CASE_STUDIES_DATA: Record<string, CaseStudy> = {
  // ──────────────────────────────────────────────────────────────
  // 1) Oman environmental performance ranking (Consulting)
  // ──────────────────────────────────────────────────────────────
  'oman-environmental-ranking': {
    category: 'Consulting',
    icon: 'fa-ranking-star',
    gradient: GRAD.policy,
    image: '/images/projects/oman-environmental-ranking.jpg',
    en: {
      category: 'Consulting',
      title: "Boosting Oman's Environmental Performance Ranking",
      summary: "Boosting Oman's environmental performance ranking from 145th to 50th.",
      subtitle:
        'A national-scale advisory engagement that strengthened environmental governance, data, and capacity to move the country sharply up the international rankings.',
      overview: {
        heading: 'Overview',
        paragraphs: [
          'Sustain Plus supported a national-scale environmental performance programme aimed at improving Oman’s standing on the international environmental indices that benchmark countries on policy, data quality, and outcomes.',
          'These indices weigh dozens of indicators across air quality, water and sanitation, biodiversity, climate, and the maturity of environmental institutions. Improving a national position therefore demands coordinated work across data, policy, and the people responsible for delivery — not a single intervention.',
        ],
      },
      approach: {
        heading: 'Our Approach',
        paragraphs: [
          'We began with a structured gap assessment, benchmarking current performance against the relevant international environmental indices to pinpoint where indicators were weak, missing, or poorly evidenced.',
          'From that baseline we advised on targeted policy and data improvements — closing reporting gaps, strengthening monitoring, and aligning national practice with recognised methodologies so that progress would register on the indices.',
          'Throughout the engagement we ran capacity-building work with the institutions responsible for environmental data and reporting, so the gains would be owned locally and sustained beyond the project.',
        ],
      },
      outcome: {
        heading: 'The Outcome',
        paragraphs: [
          'The programme delivered a step-change in measured environmental performance: Oman’s ranking improved from 145th to 50th.',
          'Beyond the headline position, the work left behind stronger environmental data, clearer policy alignment with international methodologies, and trained teams able to maintain and build on the improvement.',
        ],
      },
      facts: [
        { icon: 'fa-ranking-star', label: 'Ranking improvement', value: '145th → 50th' },
        { icon: 'fa-flag', label: 'Scope', value: 'National environmental performance' },
        { icon: 'fa-clipboard-check', label: 'Method', value: 'Gap assessment vs. international indices' },
        { icon: 'fa-people-group', label: 'Sustained by', value: 'Capacity building & training' },
      ],
    },
    ar: {
      category: 'استشارات',
      title: 'رفع تصنيف الأداء البيئي لسلطنة عُمان',
      summary: 'رفع تصنيف الأداء البيئي لسلطنة عُمان من المركز 145 إلى المركز 50.',
      subtitle:
        'مهمة استشارية على المستوى الوطني عزّزت الحوكمة البيئية والبيانات والقدرات لتحقيق قفزة كبيرة في التصنيف الدولي.',
      overview: {
        heading: 'نظرة عامة',
        paragraphs: [
          'دعمت ساستين بلس برنامجاً للأداء البيئي على المستوى الوطني يهدف إلى تحسين موقع سلطنة عُمان في المؤشرات البيئية الدولية التي تقيس أداء الدول من حيث السياسات وجودة البيانات والنتائج.',
          'تزن هذه المؤشرات عشرات المعايير عبر جودة الهواء والمياه والصرف الصحي والتنوع البيولوجي والمناخ ونضج المؤسسات البيئية. لذا فإن تحسين الموقع الوطني يتطلب عملاً منسّقاً عبر البيانات والسياسات والكوادر المسؤولة عن التنفيذ، وليس تدخلاً منفرداً.',
        ],
      },
      approach: {
        heading: 'منهجيتنا',
        paragraphs: [
          'بدأنا بتقييم منهجي للفجوات، يقارن الأداء الحالي بالمؤشرات البيئية الدولية ذات الصلة لتحديد المعايير الضعيفة أو الناقصة أو غير المدعومة بالأدلة.',
          'من خط الأساس هذا، قدّمنا المشورة بشأن تحسينات مستهدفة في السياسات والبيانات — سدّ فجوات الإبلاغ، وتعزيز الرصد، ومواءمة الممارسة الوطنية مع المنهجيات المعتمدة بحيث يُسجَّل التقدّم على المؤشرات.',
          'وعلى امتداد المهمة، نفّذنا برامج بناء قدرات مع المؤسسات المسؤولة عن البيانات والتقارير البيئية، حتى تكون المكاسب مملوكة محلياً ومستدامة بعد انتهاء المشروع.',
        ],
      },
      outcome: {
        heading: 'النتيجة',
        paragraphs: [
          'حقّق البرنامج نقلة نوعية في الأداء البيئي المقاس: تحسّن تصنيف سلطنة عُمان من المركز 145 إلى المركز 50.',
          'وإلى جانب الترتيب الرئيسي، خلّف العمل بيانات بيئية أقوى، ومواءمة أوضح للسياسات مع المنهجيات الدولية، وفِرَقاً مدرَّبة قادرة على الحفاظ على التحسّن والبناء عليه.',
        ],
      },
      facts: [
        { icon: 'fa-ranking-star', label: 'تحسّن التصنيف', value: 'المركز 145 ← 50' },
        { icon: 'fa-flag', label: 'النطاق', value: 'الأداء البيئي الوطني' },
        { icon: 'fa-clipboard-check', label: 'المنهج', value: 'تقييم فجوات مقابل المؤشرات الدولية' },
        { icon: 'fa-people-group', label: 'استدامة عبر', value: 'بناء القدرات والتدريب' },
      ],
    },
  },

  // ──────────────────────────────────────────────────────────────
  // 2) Ras El Hekma desalination (Engineering) — FEATURED
  // ──────────────────────────────────────────────────────────────
  'ras-el-hekma-desalination': {
    category: 'Engineering',
    icon: 'fa-water',
    gradient: GRAD.water,
    image: '/images/projects/ras-el-hekma-desalination.jpg',
    en: {
      category: 'Engineering',
      title: 'Ras El Hekma Seawater Desalination Plant',
      summary:
        'High-efficiency seawater desalination plant, 1,100 m³/day using SWRO/ROO technology to support sustainable tourism in Ras El Hekma.',
      subtitle:
        'A high-efficiency SWRO plant with energy recovery, delivering reliable, WHO-compliant drinking water to support sustainable coastal development.',
      overview: {
        heading: 'Overview',
        paragraphs: [
          'Coastal tourism and resort developments at Ras El Hekma need a secure, year-round supply of high-quality drinking water in a setting where freshwater is scarce. Sustain Plus engineered a high-efficiency seawater desalination plant to meet that demand sustainably.',
          'The plant is built around seawater reverse osmosis (SWRO) and is designed to deliver up to 1,100 m³/day per unit — sized to support coastal and resort water supply while keeping its energy and environmental footprint low.',
        ],
      },
      approach: {
        heading: 'Engineering Approach',
        paragraphs: [
          'At the heart of the design is SWRO paired with Energy Recovery Devices (ERD), which capture and reuse pressure energy from the reject stream. This is the basis of the plant’s efficiency: it cuts specific energy consumption — the kWh consumed per cubic metre of water produced — by roughly 30%.',
          'The process is engineered so the treated water meets WHO drinking-water standards, with the multi-stage pre-treatment and membrane configuration needed to handle a demanding seawater feed reliably.',
          'Modular, per-unit capacity of up to 1,100 m³/day allows supply to be scaled and matched to seasonal resort demand without over-building.',
        ],
      },
      outcome: {
        heading: 'The Outcome',
        paragraphs: [
          'The result is a dependable source of WHO-compliant drinking water for coastal and resort use at Ras El Hekma, produced with around 30% lower specific energy consumption than a conventional comparator thanks to energy recovery.',
          'By lowering both the energy and environmental footprint of fresh-water production, the plant directly supports the sustainable-tourism ambitions of the destination.',
        ],
      },
      facts: [
        { icon: 'fa-gauge-high', label: 'Capacity', value: 'Up to 1,100 m³/day per unit' },
        { icon: 'fa-bolt', label: 'Specific energy', value: '~30% lower (kWh/m³)' },
        { icon: 'fa-filter', label: 'Technology', value: 'SWRO with Energy Recovery Devices (ERD)' },
        { icon: 'fa-droplet', label: 'Water quality', value: 'Meets WHO drinking-water standards' },
      ],
    },
    ar: {
      category: 'هندسة',
      title: 'محطة تحلية مياه البحر في رأس الحكمة',
      summary:
        'محطة تحلية مياه بحر عالية الكفاءة بطاقة 1,100 م³/يوم باستخدام تقنية SWRO/ROO لدعم السياحة المستدامة في رأس الحكمة.',
      subtitle:
        'محطة SWRO عالية الكفاءة مزوّدة باستعادة الطاقة، توفّر مياه شرب موثوقة مطابقة لمعايير منظمة الصحة العالمية لدعم التنمية الساحلية المستدامة.',
      overview: {
        heading: 'نظرة عامة',
        paragraphs: [
          'تحتاج المشروعات السياحية والمنتجعات في رأس الحكمة إلى إمداد آمن وعلى مدار العام بمياه شرب عالية الجودة في بيئة تندر فيها المياه العذبة. صمّمت ساستين بلس محطة تحلية مياه بحر عالية الكفاءة لتلبية هذا الطلب بشكل مستدام.',
          'تعتمد المحطة على التناضح العكسي لمياه البحر (SWRO) وصُمّمت لإنتاج ما يصل إلى 1,100 م³/يوم لكل وحدة — بحجم يدعم إمداد المياه الساحلية والمنتجعات مع الإبقاء على بصمتها الطاقية والبيئية منخفضة.',
        ],
      },
      approach: {
        heading: 'المنهج الهندسي',
        paragraphs: [
          'يقوم التصميم على تقنية SWRO مقترنة بأجهزة استعادة الطاقة (ERD) التي تلتقط طاقة الضغط من تيار الرفض وتعيد استخدامها. هذا هو أساس كفاءة المحطة: إذ يخفض الاستهلاك النوعي للطاقة — أي الكيلوواط/ساعة المستهلكة لكل متر مكعب من المياه المنتجة — بنحو 30%.',
          'صُمّمت العملية بحيث تطابق المياه المعالَجة معايير مياه الشرب الصادرة عن منظمة الصحة العالمية، مع المعالجة الأولية متعددة المراحل وتكوين الأغشية اللازم للتعامل مع مياه بحر متطلّبة بموثوقية.',
          'وتتيح الطاقة المعيارية لكل وحدة، التي تصل إلى 1,100 م³/يوم، توسيع الإمداد ومواءمته مع الطلب الموسمي للمنتجعات دون إفراط في البناء.',
        ],
      },
      outcome: {
        heading: 'النتيجة',
        paragraphs: [
          'النتيجة مصدر موثوق لمياه شرب مطابقة لمعايير منظمة الصحة العالمية للاستخدام الساحلي والمنتجعات في رأس الحكمة، يُنتَج باستهلاك نوعي للطاقة أقل بنحو 30% مقارنةً بنظير تقليدي بفضل استعادة الطاقة.',
          'وبخفض البصمة الطاقية والبيئية لإنتاج المياه العذبة، تدعم المحطة بشكل مباشر طموحات السياحة المستدامة للوجهة.',
        ],
      },
      facts: [
        { icon: 'fa-gauge-high', label: 'الطاقة الإنتاجية', value: 'حتى 1,100 م³/يوم لكل وحدة' },
        { icon: 'fa-bolt', label: 'الاستهلاك النوعي', value: 'أقل بنحو 30% (kWh/m³)' },
        { icon: 'fa-filter', label: 'التقنية', value: 'SWRO مع أجهزة استعادة الطاقة (ERD)' },
        { icon: 'fa-droplet', label: 'جودة المياه', value: 'مطابقة لمعايير WHO لمياه الشرب' },
      ],
    },
  },

  // ──────────────────────────────────────────────────────────────
  // 3) Blue Ethanol production (Engineering)
  // ──────────────────────────────────────────────────────────────
  'blue-ethanol-production': {
    category: 'Engineering',
    icon: 'fa-flask',
    gradient: GRAD.fuel,
    image: '/images/projects/blue-ethanol-production.jpg',
    en: {
      category: 'Engineering',
      title: 'Blue Ethanol — Low-Carbon Biofuel Production',
      summary:
        'Pioneering Blue Ethanol as a low-carbon biofuel, integrating carbon-capture technologies to significantly reduce greenhouse-gas emissions.',
      subtitle:
        'A clean-fuel innovation that pairs ethanol production with integrated carbon capture to cut the greenhouse-gas intensity of the fuel.',
      overview: {
        heading: 'Overview',
        paragraphs: [
          'Blue Ethanol is part of Sustain Plus’ broader innovation in clean fuels under the Blue Fuel initiative. It reimagines ethanol production as a genuinely low-carbon biofuel rather than a conventional one.',
          'The aim is to deliver a liquid fuel that fits existing infrastructure and use cases while carrying a materially lower greenhouse-gas footprint, helping hard-to-abate sectors transition without wholesale equipment replacement.',
        ],
      },
      approach: {
        heading: 'Our Approach',
        paragraphs: [
          'The defining feature is the integration of carbon-capture technologies directly into the production process, so that CO₂ generated during fermentation and processing is captured rather than released.',
          'By engineering capture into the heart of the process, the resulting ethanol carries a significantly lower greenhouse-gas intensity than conventionally produced fuel — which is what earns it the “Blue” designation within the Blue Fuel family.',
        ],
      },
      outcome: {
        heading: 'The Outcome',
        paragraphs: [
          'The project pioneers Blue Ethanol as a low-carbon biofuel, demonstrating how carbon capture can be integrated into fuel production to significantly reduce greenhouse-gas emissions.',
          'It anchors Sustain Plus’ clean-fuels innovation agenda, offering industries a credible pathway to lower-carbon liquid fuel as part of the wider Blue Fuel portfolio.',
        ],
      },
      facts: [
        { icon: 'fa-flask', label: 'Product', value: 'Blue Ethanol (low-carbon biofuel)' },
        { icon: 'fa-cloud-arrow-down', label: 'Key technology', value: 'Integrated carbon capture' },
        { icon: 'fa-leaf', label: 'Impact', value: 'Significantly reduced GHG emissions' },
        { icon: 'fa-lightbulb', label: 'Programme', value: 'Sustain Plus Blue Fuel innovation' },
      ],
    },
    ar: {
      category: 'هندسة',
      title: 'البلو إيثانول — إنتاج وقود حيوي منخفض الكربون',
      summary:
        'ريادة إنتاج البلو إيثانول كوقود حيوي منخفض الكربون، بدمج تقنيات احتجاز الكربون لخفض انبعاثات غازات الاحتباس الحراري بشكل كبير.',
      subtitle:
        'ابتكار في الوقود النظيف يقرن إنتاج الإيثانول باحتجاز كربون مدمج لخفض كثافة غازات الاحتباس الحراري في الوقود.',
      overview: {
        heading: 'نظرة عامة',
        paragraphs: [
          'يُعدّ البلو إيثانول جزءاً من ابتكار ساستين بلس الأوسع في الوقود النظيف ضمن مبادرة Blue Fuel. وهو يعيد تصوّر إنتاج الإيثانول كوقود حيوي منخفض الكربون حقاً لا كوقود تقليدي.',
          'يهدف المشروع إلى تقديم وقود سائل يلائم البنية التحتية وحالات الاستخدام القائمة، مع بصمة أقل بشكل ملموس من غازات الاحتباس الحراري، بما يساعد القطاعات صعبة الخفض على التحوّل دون استبدال شامل للمعدات.',
        ],
      },
      approach: {
        heading: 'منهجيتنا',
        paragraphs: [
          'السمة المميِّزة هي دمج تقنيات احتجاز الكربون مباشرة في عملية الإنتاج، بحيث يُحتجَز ثاني أكسيد الكربون المتولّد أثناء التخمّر والمعالجة بدلاً من إطلاقه.',
          'وبهندسة الاحتجاز في صميم العملية، يحمل الإيثانول الناتج كثافة أقل بكثير من غازات الاحتباس الحراري مقارنةً بالوقود المنتَج تقليدياً — وهو ما يكسبه صفة «الأزرق/Blue» ضمن عائلة Blue Fuel.',
        ],
      },
      outcome: {
        heading: 'النتيجة',
        paragraphs: [
          'يُرسي المشروع ريادة البلو إيثانول كوقود حيوي منخفض الكربون، ويُظهر كيف يمكن دمج احتجاز الكربون في إنتاج الوقود لخفض انبعاثات غازات الاحتباس الحراري بشكل كبير.',
          'ويُرسّخ أجندة الابتكار في الوقود النظيف لدى ساستين بلس، إذ يقدّم للصناعات مساراً موثوقاً نحو وقود سائل أقل كربوناً ضمن محفظة Blue Fuel الأوسع.',
        ],
      },
      facts: [
        { icon: 'fa-flask', label: 'المنتج', value: 'البلو إيثانول (وقود حيوي منخفض الكربون)' },
        { icon: 'fa-cloud-arrow-down', label: 'التقنية الأساسية', value: 'احتجاز كربون مدمج' },
        { icon: 'fa-leaf', label: 'الأثر', value: 'خفض كبير لانبعاثات غازات الاحتباس الحراري' },
        { icon: 'fa-lightbulb', label: 'البرنامج', value: 'ابتكار Blue Fuel من ساستين بلس' },
      ],
    },
  },

  // ──────────────────────────────────────────────────────────────
  // 4) Ethydco EPD certification (Consulting)
  // ──────────────────────────────────────────────────────────────
  'ethydco-epd-certification': {
    category: 'Consulting',
    icon: 'fa-certificate',
    gradient: GRAD.lca,
    image: '/images/projects/ethydco-epd-certification.jpg',
    en: {
      category: 'Consulting',
      title: 'Ethydco — LCA & EPD Registration for Polyethylene',
      summary: 'Life Cycle Assessment (LCA) and EPD registration for polyethylene products.',
      subtitle:
        'A cradle-to-gate LCA and Environmental Product Declaration that brought verified environmental transparency to Ethydco’s polyethylene.',
      overview: {
        heading: 'Overview',
        paragraphs: [
          'Ethydco sought to demonstrate the environmental credentials of its polyethylene products with the credibility that international markets increasingly require. Sustain Plus delivered the Life Cycle Assessment and Environmental Product Declaration (EPD) to make that possible.',
          'An EPD is an independently registered, standards-based summary of a product’s environmental performance — a recognised passport for environmentally conscious procurement and export.',
        ],
      },
      approach: {
        heading: 'Our Approach',
        paragraphs: [
          'We carried out a cradle-to-gate Life Cycle Assessment in line with ISO 14040 and ISO 14044, quantifying the environmental impacts of the polyethylene from raw-material extraction through to the factory gate.',
          'The validated LCA results were then compiled into an Environmental Product Declaration and taken through EPD registration, producing a transparent, third-party-recognised statement of the product’s environmental profile.',
        ],
      },
      outcome: {
        heading: 'The Outcome',
        paragraphs: [
          'Ethydco’s polyethylene now carries a registered EPD underpinned by a robust cradle-to-gate LCA, providing verified environmental transparency to customers and regulators.',
          'The declaration enables market access where EPDs are expected and supports the company’s positioning in sustainability-driven supply chains.',
        ],
      },
      facts: [
        { icon: 'fa-recycle', label: 'Study type', value: 'Cradle-to-gate LCA' },
        { icon: 'fa-certificate', label: 'Standards', value: 'ISO 14040 / 14044' },
        { icon: 'fa-file-circle-check', label: 'Deliverable', value: 'Registered EPD' },
        { icon: 'fa-cube', label: 'Product', value: 'Polyethylene' },
      ],
    },
    ar: {
      category: 'استشارات',
      title: 'إيثيدكو — تقييم دورة الحياة وتسجيل EPD للبولي إيثيلين',
      summary: 'تقييم دورة الحياة (LCA) وتسجيل الإعلان البيئي للمنتج (EPD) لمنتجات البولي إيثيلين.',
      subtitle:
        'تقييم دورة حياة من المهد إلى البوابة وإعلان بيئي للمنتج أضفيا شفافية بيئية موثّقة على البولي إيثيلين من إيثيدكو.',
      overview: {
        heading: 'نظرة عامة',
        paragraphs: [
          'سعت إيثيدكو إلى إثبات الجدارة البيئية لمنتجات البولي إيثيلين لديها بالمصداقية التي تطلبها الأسواق الدولية بشكل متزايد. وقدّمت ساستين بلس تقييم دورة الحياة والإعلان البيئي للمنتج (EPD) لتحقيق ذلك.',
          'الإعلان البيئي للمنتج هو ملخّص مسجَّل بشكل مستقل وقائم على المعايير لأداء المنتج البيئي — بمثابة جواز معترف به للمشتريات والتصدير المراعية للبيئة.',
        ],
      },
      approach: {
        heading: 'منهجيتنا',
        paragraphs: [
          'أجرينا تقييماً لدورة الحياة من المهد إلى البوابة وفق معياري ISO 14040 وISO 14044، يقيس الآثار البيئية للبولي إيثيلين من استخراج المواد الخام حتى بوابة المصنع.',
          'ثم جُمِّعت نتائج التقييم المُتحقَّق منها في إعلان بيئي للمنتج وأُخِذت عبر تسجيل EPD، لإنتاج بيان شفّاف معترف به من طرف ثالث للملف البيئي للمنتج.',
        ],
      },
      outcome: {
        heading: 'النتيجة',
        paragraphs: [
          'أصبح البولي إيثيلين من إيثيدكو يحمل الآن إعلاناً بيئياً مسجَّلاً مدعوماً بتقييم متين لدورة الحياة من المهد إلى البوابة، يوفّر شفافية بيئية موثّقة للعملاء والجهات التنظيمية.',
          'ويتيح الإعلان النفاذ إلى الأسواق التي يُتوقَّع فيها وجود EPD، ويدعم مكانة الشركة في سلاسل التوريد القائمة على الاستدامة.',
        ],
      },
      facts: [
        { icon: 'fa-recycle', label: 'نوع الدراسة', value: 'تقييم دورة حياة من المهد إلى البوابة' },
        { icon: 'fa-certificate', label: 'المعايير', value: 'ISO 14040 / 14044' },
        { icon: 'fa-file-circle-check', label: 'المُخرَج', value: 'إعلان بيئي مسجَّل (EPD)' },
        { icon: 'fa-cube', label: 'المنتج', value: 'البولي إيثيلين' },
      ],
    },
  },

  // ──────────────────────────────────────────────────────────────
  // 5) ADNOC decarbonization training (Training)
  // ──────────────────────────────────────────────────────────────
  'adnoc-decarbonization-training': {
    category: 'Training',
    icon: 'fa-chalkboard-user',
    gradient: GRAD.carbon,
    image: '/images/projects/adnoc-decarbonization-training.jpg',
    en: {
      category: 'Training',
      title: 'ADNOC — Carbon Capture & Decarbonization Training',
      summary: 'Advanced training on carbon-capture strategies and emission reduction.',
      subtitle:
        'A capacity-building programme equipping ADNOC teams with advanced knowledge of carbon-capture strategies and emission-reduction practice.',
      overview: {
        heading: 'Overview',
        paragraphs: [
          'As energy producers accelerate their decarbonization agendas, in-house expertise in carbon capture and emission reduction becomes a decisive capability. Sustain Plus delivered an advanced training programme for ADNOC to build exactly that.',
          'The programme was designed to move beyond awareness into applied competence, so participants could engage confidently with real decarbonization decisions.',
        ],
      },
      approach: {
        heading: 'Our Approach',
        paragraphs: [
          'We delivered advanced, practitioner-focused training on carbon-capture strategies — covering the principal capture approaches and how they fit into wider emission-reduction planning.',
          'Content paired technical grounding with applied decision-making, so participants left able to evaluate options and contribute to their organisation’s decarbonization strategy.',
        ],
      },
      outcome: {
        heading: 'The Outcome',
        paragraphs: [
          'ADNOC teams gained strengthened capability in carbon-capture strategies and emission reduction, supporting the organisation’s decarbonization objectives with in-house expertise.',
          'The engagement reflects Sustain Plus’ role as a capacity-building partner to major energy organisations across the region.',
        ],
      },
      facts: [
        { icon: 'fa-chalkboard-user', label: 'Format', value: 'Advanced corporate training' },
        { icon: 'fa-cloud-arrow-down', label: 'Focus', value: 'Carbon-capture strategies' },
        { icon: 'fa-smog', label: 'Theme', value: 'Emission reduction & decarbonization' },
        { icon: 'fa-building', label: 'Client', value: 'ADNOC' },
      ],
    },
    ar: {
      category: 'تدريب',
      title: 'أدنوك — تدريب على احتجاز الكربون وخفض الانبعاثات',
      summary: 'تدريب متقدّم على استراتيجيات احتجاز الكربون وخفض الانبعاثات.',
      subtitle:
        'برنامج بناء قدرات يزوّد فرق أدنوك بمعرفة متقدّمة في استراتيجيات احتجاز الكربون وممارسات خفض الانبعاثات.',
      overview: {
        heading: 'نظرة عامة',
        paragraphs: [
          'مع تسريع منتجي الطاقة لأجنداتهم في خفض الكربون، تصبح الخبرة الداخلية في احتجاز الكربون وخفض الانبعاثات قدرة حاسمة. وقد قدّمت ساستين بلس برنامج تدريب متقدّماً لأدنوك لبناء هذه القدرة تحديداً.',
          'صُمّم البرنامج لينتقل بالمشاركين من مرحلة الوعي إلى الكفاءة التطبيقية، بحيث يتمكّنون من التعامل بثقة مع قرارات خفض الكربون الفعلية.',
        ],
      },
      approach: {
        heading: 'منهجيتنا',
        paragraphs: [
          'قدّمنا تدريباً متقدّماً موجّهاً للممارسين حول استراتيجيات احتجاز الكربون — يغطّي أساليب الاحتجاز الرئيسية وكيفية اندماجها في تخطيط أوسع لخفض الانبعاثات.',
          'جمع المحتوى بين الأساس التقني واتخاذ القرار التطبيقي، بحيث يغادر المشاركون وهم قادرون على تقييم الخيارات والمساهمة في استراتيجية خفض الكربون لمؤسستهم.',
        ],
      },
      outcome: {
        heading: 'النتيجة',
        paragraphs: [
          'اكتسبت فرق أدنوك قدرة معزَّزة في استراتيجيات احتجاز الكربون وخفض الانبعاثات، بما يدعم أهداف المؤسسة في خفض الكربون بخبرة داخلية.',
          'وتعكس هذه المهمة دور ساستين بلس كشريك في بناء القدرات لكبرى مؤسسات الطاقة في المنطقة.',
        ],
      },
      facts: [
        { icon: 'fa-chalkboard-user', label: 'الصيغة', value: 'تدريب مؤسسي متقدّم' },
        { icon: 'fa-cloud-arrow-down', label: 'التركيز', value: 'استراتيجيات احتجاز الكربون' },
        { icon: 'fa-smog', label: 'الموضوع', value: 'خفض الانبعاثات وخفض الكربون' },
        { icon: 'fa-building', label: 'العميل', value: 'أدنوك' },
      ],
    },
  },

  // ──────────────────────────────────────────────────────────────
  // 6) GSK sustainability leadership (Training)
  // ──────────────────────────────────────────────────────────────
  'gsk-sustainability-leadership': {
    category: 'Training',
    icon: 'fa-users-gear',
    gradient: GRAD.training,
    image: '/images/projects/gsk-sustainability-leadership.jpg',
    en: {
      category: 'Training',
      title: 'GSK — Sustainability Leadership for MEA Managers',
      summary: 'Training MEA managers on sustainability reporting and implementation.',
      subtitle:
        'A leadership programme equipping GSK’s Middle East & Africa managers to lead sustainability reporting and implementation.',
      overview: {
        heading: 'Overview',
        paragraphs: [
          'Sustainability commitments only translate into results when managers across a region can report credibly and implement on the ground. Sustain Plus delivered a leadership programme for GSK’s Middle East & Africa (MEA) managers to build that capability.',
          'The programme targeted the people who turn corporate sustainability ambition into operational practice across multiple markets.',
        ],
      },
      approach: {
        heading: 'Our Approach',
        paragraphs: [
          'We trained MEA managers on sustainability reporting — the frameworks, data, and disclosure practices needed to communicate performance credibly.',
          'Alongside reporting, the programme addressed implementation: translating sustainability commitments into action within their teams and operations, so reporting reflected real progress.',
        ],
      },
      outcome: {
        heading: 'The Outcome',
        paragraphs: [
          'GSK’s MEA managers came away better equipped to lead both sustainability reporting and implementation across the region.',
          'The engagement underlines Sustain Plus’ capability to deliver sustainability leadership development for multinational organisations.',
        ],
      },
      facts: [
        { icon: 'fa-users-gear', label: 'Audience', value: 'GSK MEA managers' },
        { icon: 'fa-file-lines', label: 'Focus', value: 'Sustainability reporting' },
        { icon: 'fa-gears', label: 'Focus', value: 'Implementation on the ground' },
        { icon: 'fa-earth-africa', label: 'Region', value: 'Middle East & Africa (MEA)' },
      ],
    },
    ar: {
      category: 'تدريب',
      title: 'GSK — قيادة الاستدامة لمديري الشرق الأوسط وأفريقيا',
      summary: 'تدريب مديري منطقة الشرق الأوسط وأفريقيا على إعداد تقارير الاستدامة وتطبيقها.',
      subtitle:
        'برنامج قيادي يُمكّن مديري GSK في الشرق الأوسط وأفريقيا من قيادة إعداد تقارير الاستدامة وتطبيقها.',
      overview: {
        heading: 'نظرة عامة',
        paragraphs: [
          'لا تتحوّل التزامات الاستدامة إلى نتائج إلا عندما يتمكّن المديرون عبر المنطقة من إعداد تقارير موثوقة والتطبيق على أرض الواقع. قدّمت ساستين بلس برنامجاً قيادياً لمديري GSK في الشرق الأوسط وأفريقيا (MEA) لبناء هذه القدرة.',
          'استهدف البرنامج الأشخاص الذين يحوّلون طموح الاستدامة المؤسسي إلى ممارسة تشغيلية عبر أسواق متعددة.',
        ],
      },
      approach: {
        heading: 'منهجيتنا',
        paragraphs: [
          'درّبنا مديري المنطقة على إعداد تقارير الاستدامة — الأطر والبيانات وممارسات الإفصاح اللازمة للتواصل بشأن الأداء بمصداقية.',
          'وإلى جانب إعداد التقارير، تناول البرنامج التطبيق: ترجمة التزامات الاستدامة إلى إجراءات داخل فرقهم وعملياتهم، بحيث تعكس التقارير تقدّماً حقيقياً.',
        ],
      },
      outcome: {
        heading: 'النتيجة',
        paragraphs: [
          'خرج مديرو GSK في المنطقة وهم أكثر تأهيلاً لقيادة إعداد تقارير الاستدامة وتطبيقها عبر المنطقة.',
          'وتؤكّد هذه المهمة قدرة ساستين بلس على تطوير القيادة في مجال الاستدامة للمؤسسات متعددة الجنسيات.',
        ],
      },
      facts: [
        { icon: 'fa-users-gear', label: 'الفئة المستهدفة', value: 'مديرو GSK في المنطقة' },
        { icon: 'fa-file-lines', label: 'التركيز', value: 'إعداد تقارير الاستدامة' },
        { icon: 'fa-gears', label: 'التركيز', value: 'التطبيق على أرض الواقع' },
        { icon: 'fa-earth-africa', label: 'المنطقة', value: 'الشرق الأوسط وأفريقيا (MEA)' },
      ],
    },
  },
}

/** Stable display order for the listing grid. */
export const CASE_STUDIES_ORDER: string[] = [
  'ras-el-hekma-desalination',
  'oman-environmental-ranking',
  'blue-ethanol-production',
  'ethydco-epd-certification',
  'adnoc-decarbonization-training',
  'gsk-sustainability-leadership',
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES_DATA[slug]
}

export function caseHref(slug: string, locale: Locale): string {
  return locale === 'ar' ? `/ar/case-studies/${slug}` : `/case-studies/${slug}`
}
