// ==========================================
// SUSTAIN PLUS — Insights data (EN / AR)
// Bilingual thought-leadership articles grounded in Sustain Plus's real
// domains: water/desalination, biogas/energy, ESG/LCA, regulation, circular
// economy/RDF, and decarbonization/carbon capture.
//
// These are EDUCATIONAL articles in the company's own fields. Concrete
// capability figures (capacities, energy savings ranges) reflect verified
// company facts; no client names, client results, or invented metrics appear.
// ==========================================

import { type Locale } from '@/lib/marketing'

export interface InsightSection {
  heading: string
  paragraphs: string[]
}

export interface InsightLocaleContent {
  /** Plain-language category label in this locale (also used for the eyebrow). */
  categoryLabel: string
  title: string
  excerpt: string
  body: InsightSection[]
  takeaways: string[]
}

export interface InsightEntry {
  /** Canonical English category used by the filter chips. */
  category: 'Water' | 'Energy' | 'ESG' | 'Regulation' | 'Circular Economy' | 'Carbon'
  icon: string
  date: { en: string; ar: string }
  readTime: { en: string; ar: string }
  /** Brand gradient used for the card/banner artwork. */
  gradient: string
  en: InsightLocaleContent
  ar: InsightLocaleContent
}

const GRADIENTS = {
  water: 'linear-gradient(135deg,#0C1D32 0%,#1F4A7A 55%,#2E5A93 100%)',
  energy: 'linear-gradient(135deg,#0C1D32 0%,#2E5A93 100%)',
  esg: 'linear-gradient(135deg,#16335C 0%,#3A6BA5 100%)',
  regulation: 'linear-gradient(135deg,#0A1626 0%,#1F4A7A 100%)',
  circular: 'linear-gradient(135deg,#102747 0%,#1F4A7A 55%,#6E93C4 100%)',
  carbon: 'linear-gradient(135deg,#0C1D32 0%,#1F4A7A 60%,#2E5A93 100%)',
} as const

/** Display order on the listing page (first entry is treated as featured). */
export const INSIGHTS_ORDER = [
  'soil-remediation',
  'roo-desalination',
  'biogas-cogeneration',
  'lca-epd',
  'eia-egypt',
  'circular-economy-rdf',
  'decarbonization-carbon-capture',
] as const

export const INSIGHTS_DATA: Record<string, InsightEntry> = {
  // ────────────────────────────────────────────────────────────
  // 0) CIRCULAR ECONOMY — Soil remediation (from a real Sustain Plus post)
  // ────────────────────────────────────────────────────────────
  'soil-remediation': {
    category: 'Circular Economy',
    icon: 'fa-road',
    date: { en: 'January 2026', ar: 'يناير 2026' },
    readTime: { en: '6 min read', ar: 'قراءة 6 دقائق' },
    gradient: GRADIENTS.circular,
    en: {
      categoryLabel: 'Circular Economy',
      title: 'Reusing petroleum-contaminated soil in road paving: from environmental burden to sustainable resource',
      excerpt:
        'For years, the standard answer to petroleum-contaminated soil was costly burial in secure landfills. With the right solidification and stabilization treatment, that same soil can be safely reused in road paving — turning a liability into a resource.',
      body: [
        {
          heading: 'From burden to resource',
          paragraphs: [
            'In the past, the conventional solution for soil contaminated with petroleum substances was burial in secure landfills — a high-cost option with a lasting environmental footprint.',
            'Today, by applying the right treatment techniques using solidification and stabilization (S/S) materials, that soil can be safely reused in road paving, concrete roads, and sub-base / replacement layers.',
          ],
        },
        {
          heading: 'Why this solution matters',
          paragraphs: [
            'Reusing treated soil instead of landfilling it delivers benefits across the board: it reduces the volume of hazardous waste, protects soil and groundwater, lowers reliance on virgin raw materials, and cuts the carbon emissions tied to transport and quarrying.',
          ],
        },
        {
          heading: 'A circular-economy play aligned with the SDGs',
          paragraphs: [
            'Shifting from burial to safe reuse is a practical application of the circular economy — and it shows that environmental solutions can be cost-effective at the same time.',
            'The approach directly supports the UN Sustainable Development Goals, especially SDG 9 (resilient, sustainable infrastructure), SDG 11 (sustainable cities), SDG 12 (responsible consumption and production), and SDG 13 (climate action).',
          ],
        },
      ],
      takeaways: [
        'Solidification & stabilization lets petroleum-contaminated soil be reused safely in road paving and sub-base layers.',
        'Reuse cuts hazardous-waste volumes and protects soil and groundwater.',
        'It reduces demand for virgin materials and the emissions from transport and quarrying.',
        'A practical circular-economy model that is environmentally and economically effective — aligned with SDGs 9, 11, 12 & 13.',
      ],
    },
    ar: {
      categoryLabel: 'الاقتصاد الدائري',
      title: 'إعادة استخدام التربة الملوثة بالمواد البترولية في رصف الطرق: من عبء بيئي إلى مورد مستدام',
      excerpt:
        'لسنوات كان الحل التقليدي للتربة الملوثة بالمواد البترولية هو الدفن في مدافن آمنة بتكلفة مرتفعة. ومع تطبيق المعالجة المناسبة بتقنيات التصلّب والتثبيت، أصبح من الممكن إعادة استخدام التربة نفسها بأمان في رصف الطرق — لتتحوّل من عبء إلى مورد.',
      body: [
        {
          heading: 'من عبء إلى مورد',
          paragraphs: [
            'في الماضي، كان الحل التقليدي للتربة الملوثة بالمواد البترولية هو الدفن في مدافن آمنة بتكلفة مرتفعة وتأثير بيئي ممتد.',
            'واليوم، ومع تطبيق تقنيات المعالجة المناسبة باستخدام مواد التصلّب والتثبيت (Solidification & Stabilization)، أصبح من الممكن إعادة استخدامها بأمان في رصف الطرق والطرق الخرسانية وطبقات الإحلال.',
          ],
        },
        {
          heading: 'لماذا هذا الحل مهم؟',
          paragraphs: [
            'إعادة استخدام التربة المعالَجة بدلاً من دفنها تحقّق فوائد على عدة محاور: تقليل كميات المخلفات الخطرة، وحماية التربة والمياه الجوفية، وخفض الاعتماد على المواد الخام الطبيعية، وتقليل الانبعاثات الكربونية المرتبطة بالنقل والمحاجر.',
          ],
        },
        {
          heading: 'تطبيق عملي للاقتصاد الدائري متوائم مع أهداف التنمية المستدامة',
          paragraphs: [
            'التحوّل من الدفن إلى إعادة الاستخدام الآمن هو تطبيق عملي لمفهوم الاقتصاد الدائري، ويؤكد أن الحلول البيئية يمكن أن تكون فعّالة اقتصاديًا في الوقت نفسه.',
            'ويدعم هذا النهج بشكل مباشر أهداف التنمية المستدامة، خاصة الهدف 9 (بنية تحتية مرنة ومستدامة)، والهدف 11 (مدن مستدامة)، والهدف 12 (إنتاج واستهلاك مسؤول)، والهدف 13 (العمل المناخي).',
          ],
        },
      ],
      takeaways: [
        'تقنيات التصلّب والتثبيت تتيح إعادة استخدام التربة الملوثة بالبترول بأمان في رصف الطرق وطبقات الإحلال.',
        'إعادة الاستخدام تقلّل كميات المخلفات الخطرة وتحمي التربة والمياه الجوفية.',
        'تخفض الطلب على المواد الخام الطبيعية وانبعاثات النقل والمحاجر.',
        'نموذج عملي للاقتصاد الدائري فعّال بيئيًا واقتصاديًا — متوائم مع أهداف التنمية المستدامة 9 و11 و12 و13.',
      ],
    },
  },

  // ────────────────────────────────────────────────────────────
  // 1) WATER — ROO / SWRO desalination
  // ────────────────────────────────────────────────────────────
  'roo-desalination': {
    category: 'Water',
    icon: 'fa-droplet',
    date: { en: 'May 26, 2026', ar: '26 مايو 2026' },
    readTime: { en: '8 min read', ar: 'قراءة 8 دقائق' },
    gradient: GRADIENTS.water,
    en: {
      categoryLabel: 'Water',
      title: 'ROO / SWRO desalination: cutting the energy cost of fresh water',
      excerpt:
        'Seawater reverse osmosis turns the Mediterranean into a reliable freshwater supply — but energy is the bill that never stops arriving. Here is how modern ROO design and energy recovery cut the specific energy of desalinated water and make coastal supply viable.',
      body: [
        {
          heading: 'Why desalination is an energy question first',
          paragraphs: [
            'Egypt and the wider region face a structural freshwater gap. With limited renewable surface water and growing demand from cities, tourism, agriculture, and industry, seawater desalination has shifted from a last resort to core infrastructure. Reverse Osmosis Operation (ROO) — built around Seawater Reverse Osmosis (SWRO) membranes — is the dominant technology because it scales cleanly and produces consistent water quality.',
            'But the defining metric of any desalination plant is not how much water it makes; it is how much energy each cubic metre costs. Specific energy consumption, measured in kilowatt-hours per cubic metre (kWh/m³), determines both the operating cost and the carbon footprint of every litre delivered. Pushing seawater through a semipermeable membrane against its natural osmotic pressure is inherently energy-intensive, so the whole engineering discipline of modern SWRO is about doing that work as efficiently as physics allows.',
          ],
        },
        {
          heading: 'How SWRO and energy recovery devices work together',
          paragraphs: [
            'In an SWRO train, high-pressure pumps raise feed seawater above its osmotic pressure and force it across membrane elements. Roughly half of that pressurised flow passes through as fresh permeate; the rest leaves as concentrate (brine) still carrying most of the pressure energy that was pumped into it. Discarding that brine straight to the outfall would waste a large share of the plant\'s electricity.',
            'Energy Recovery Devices (ERDs) capture the pressure energy in the brine stream and transfer it back to the incoming feed. Modern isobaric ERDs do this with very high efficiency, which is why a well-designed plant can reach a specific energy roughly 30% lower than a comparable system without recovery. Paired with high-efficiency pumps, variable-speed drives, and membranes selected for the local salinity and temperature, energy recovery is the single biggest lever on the lifetime cost of desalinated water.',
          ],
        },
        {
          heading: 'Water quality, brine, and zero liquid discharge',
          paragraphs: [
            'Producing water that is safe to drink means designing the full treatment train — pretreatment, the SWRO pass itself, and post-treatment remineralisation and disinfection — to meet World Health Organization (WHO) drinking-water guidelines for parameters such as total dissolved solids, boron, and microbiological safety. Process design, not just membrane choice, determines whether the plant consistently hits those targets.',
            'The other half of responsible desalination is what leaves the plant. Concentrated brine must be managed so it does not damage the receiving marine environment. Where discharge is constrained, Zero Liquid Discharge (ZLD) configurations recover additional water and reduce the residual stream to a solid, eliminating liquid brine outfall entirely. ZLD raises both capital and energy intensity, so it is specified where the site, the regulator, or the surrounding ecology require it.',
          ],
        },
        {
          heading: 'A practical fit for coastal tourism and new development',
          paragraphs: [
            'Coastal tourism and new coastal cities are where the economics line up best. These developments sit directly on a limitless seawater source, carry high and visible water demand, and cannot tolerate supply interruptions. Large coastal development programmes on the North Coast — the kind of integrated approach being applied around Ras El Hekma — depend on desalination capacity that is both reliable and energy-aware from day one.',
            'For developers and operators, the lesson is to treat desalination as an infrastructure decision made early, alongside power and land planning. Specifying energy recovery, the right membrane configuration, and a credible brine strategy at the design stage is far cheaper than retrofitting them once the plant is built — and it is what keeps the cost of fresh water under control over a multi-decade operating life.',
          ],
        },
      ],
      takeaways: [
        'Specific energy (kWh/m³) — not capacity — is the metric that drives the cost and carbon of desalinated water.',
        'Energy Recovery Devices recycle brine pressure and can cut SWRO specific energy by roughly 30%.',
        'A full treatment train designed to WHO drinking-water guidelines is what makes the output safe, not membranes alone.',
        'Zero Liquid Discharge (ZLD) eliminates liquid brine outfall where the site or regulator demands it.',
        'Coastal tourism and new coastal cities are the strongest fit — plan desalination as early-stage infrastructure.',
      ],
    },
    ar: {
      categoryLabel: 'المياه',
      title: 'تحلية المياه ROO / SWRO: خفض كلفة الطاقة للمياه العذبة',
      excerpt:
        'التناضح العكسي لمياه البحر يحوّل البحر المتوسط إلى مصدر موثوق للمياه العذبة — لكن الطاقة هي الفاتورة التي لا تتوقف. إليك كيف يخفض التصميم الحديث لأنظمة ROO واسترداد الطاقة استهلاك الطاقة النوعي للمياه المحلّاة ويجعل الإمداد الساحلي مجدياً.',
      body: [
        {
          heading: 'لماذا تحلية المياه مسألة طاقة في المقام الأول',
          paragraphs: [
            'تواجه مصر والمنطقة فجوة هيكلية في المياه العذبة. ومع محدودية المياه السطحية المتجددة وتنامي الطلب من المدن والسياحة والزراعة والصناعة، تحوّلت تحلية مياه البحر من حل أخير إلى بنية تحتية أساسية. ويعدّ تشغيل التناضح العكسي (ROO) المبني على أغشية التناضح العكسي لمياه البحر (SWRO) التقنية السائدة لأنه يتوسّع بسلاسة وينتج جودة مياه ثابتة.',
            'لكن المؤشر الحاسم لأي محطة تحلية ليس كمية المياه التي تنتجها، بل كمية الطاقة التي يكلّفها كل متر مكعب. فاستهلاك الطاقة النوعي، مقاساً بالكيلوواط-ساعة لكل متر مكعب (kWh/m³)، يحدّد تكلفة التشغيل والبصمة الكربونية لكل لتر يُسلَّم. ولأن دفع مياه البحر عبر غشاء شبه نفّاذ ضد ضغطها الأسموزي الطبيعي عملية كثيفة الاستهلاك للطاقة، فإن جوهر هندسة أنظمة SWRO الحديثة هو إنجاز هذا العمل بأعلى كفاءة تسمح بها الفيزياء.',
          ],
        },
        {
          heading: 'كيف تعمل أغشية SWRO وأجهزة استرداد الطاقة معاً',
          paragraphs: [
            'في وحدة SWRO، ترفع المضخات عالية الضغط مياه التغذية فوق ضغطها الأسموزي وتدفعها عبر عناصر الأغشية. يمرّ نحو نصف هذا التدفق المضغوط كمياه نفّاذة عذبة، فيما يخرج الباقي كمركّز (محلول ملحي) لا يزال يحمل معظم طاقة الضغط التي ضُخّت فيه. والتخلص من هذا المحلول الملحي مباشرة يهدر حصة كبيرة من كهرباء المحطة.',
            'تلتقط أجهزة استرداد الطاقة (ERDs) طاقة الضغط في تيار المحلول الملحي وتنقلها إلى مياه التغذية الداخلة. وتقوم الأجهزة الإيزوباريّة الحديثة بذلك بكفاءة عالية جداً، ولهذا يمكن لمحطة مصمَّمة جيداً أن تحقق استهلاك طاقة نوعياً أقل بنحو 30% من نظام مماثل بلا استرداد. وبالاقتران مع مضخات عالية الكفاءة ومحركات متغيرة السرعة وأغشية مختارة وفق ملوحة الموقع وحرارته، يبقى استرداد الطاقة أكبر عامل مؤثر في كلفة المياه المحلّاة على مدى عمر المحطة.',
          ],
        },
        {
          heading: 'جودة المياه والمحلول الملحي والتصريف السائل الصفري',
          paragraphs: [
            'إنتاج مياه آمنة للشرب يعني تصميم منظومة المعالجة الكاملة — المعالجة الأولية، ومرحلة SWRO نفسها، والمعالجة اللاحقة لإعادة المعدنة والتعقيم — لتلبية إرشادات منظمة الصحة العالمية (WHO) لمياه الشرب في معايير مثل إجمالي الأملاح الذائبة والبورون والأمان الميكروبيولوجي. فتصميم العملية، لا اختيار الغشاء وحده، هو ما يحدّد بلوغ هذه المستهدفات باستمرار.',
            'أما النصف الآخر من التحلية المسؤولة فهو ما يخرج من المحطة. إذ يجب إدارة المحلول الملحي المركّز كي لا يضرّ بالبيئة البحرية المستقبِلة. وحيث يكون التصريف مقيَّداً، تستردّ تكوينات التصريف السائل الصفري (ZLD) مزيداً من المياه وتختزل التيار المتبقي إلى صلب، ما يلغي تصريف المحلول الملحي السائل كلياً. ويرفع نظام ZLD الكلفة الرأسمالية وكثافة الطاقة معاً، ولذلك يُحدَّد حيث يتطلبه الموقع أو الجهة التنظيمية أو البيئة المحيطة.',
          ],
        },
        {
          heading: 'ملاءمة عملية للسياحة الساحلية والتطوير الجديد',
          paragraphs: [
            'تتوافق الاقتصاديات على أفضل وجه في السياحة الساحلية والمدن الساحلية الجديدة. فهذه التطويرات تقع مباشرة على مصدر لا محدود من مياه البحر، وتحمل طلباً مائياً مرتفعاً وظاهراً، ولا تحتمل انقطاع الإمداد. وتعتمد برامج التطوير الساحلي الكبرى على الساحل الشمالي — من النوع التكاملي المطبَّق في نطاق رأس الحكمة — على قدرة تحلية موثوقة وواعية بالطاقة منذ اليوم الأول.',
            'وبالنسبة للمطوّرين والمشغّلين، الدرس هو التعامل مع التحلية كقرار بنية تحتية يُتّخذ مبكراً إلى جانب تخطيط الطاقة والأراضي. فتحديد استرداد الطاقة وتكوين الأغشية المناسب واستراتيجية محلول ملحي موثوقة في مرحلة التصميم أرخص بكثير من إضافتها لاحقاً بعد بناء المحطة — وهو ما يُبقي كلفة المياه العذبة تحت السيطرة طوال عمر تشغيلي يمتد عقوداً.',
          ],
        },
      ],
      takeaways: [
        'استهلاك الطاقة النوعي (kWh/m³) — لا الطاقة الإنتاجية — هو المؤشر الذي يحكم كلفة المياه المحلّاة وبصمتها الكربونية.',
        'تعيد أجهزة استرداد الطاقة استخدام ضغط المحلول الملحي ويمكنها خفض الطاقة النوعية لأنظمة SWRO بنحو 30%.',
        'منظومة معالجة كاملة مصمَّمة وفق إرشادات WHO لمياه الشرب هي ما يجعل الناتج آمناً، لا الأغشية وحدها.',
        'يلغي نظام التصريف السائل الصفري (ZLD) تصريف المحلول الملحي السائل حيث يتطلبه الموقع أو الجهة التنظيمية.',
        'السياحة الساحلية والمدن الساحلية الجديدة هي الأنسب — خطّط للتحلية كبنية تحتية في مرحلة مبكرة.',
      ],
    },
  },

  // ────────────────────────────────────────────────────────────
  // 2) ENERGY — Biogas cogeneration
  // ────────────────────────────────────────────────────────────
  'biogas-cogeneration': {
    category: 'Energy',
    icon: 'fa-bolt',
    date: { en: 'May 14, 2026', ar: '14 مايو 2026' },
    readTime: { en: '7 min read', ar: 'قراءة 7 دقائق' },
    gradient: GRADIENTS.energy,
    en: {
      categoryLabel: 'Energy',
      title: 'From organic waste to power: how biogas cogeneration works',
      excerpt:
        'Organic and agricultural waste is a liability when it rots in the open and an asset when it is digested under control. This is how anaerobic digestion plus combined heat and power turns up to 15,000 m³/day of waste into electricity, heat, and fertiliser.',
      body: [
        {
          heading: 'The problem hiding in organic waste',
          paragraphs: [
            'Food-processing residues, agricultural by-products, animal manure, and the organic fraction of municipal waste all share a problem: left to decompose in the open or in landfill, they emit methane straight to the atmosphere, attract pests, and pollute soil and water. Methane is a far more potent greenhouse gas than carbon dioxide over the short term, so uncontrolled organic decay is both a nuisance and a climate liability.',
            'Anaerobic digestion captures that same biological process and puts it inside a sealed reactor. Instead of escaping, the methane becomes a fuel. A well-fed plant can process up to 15,000 m³/day of organic and agricultural waste, converting a disposal headache into a continuous source of energy and soil nutrients.',
          ],
        },
        {
          heading: 'Anaerobic digestion, step by step',
          paragraphs: [
            'Inside an oxygen-free digester, communities of micro-organisms break down organic matter through hydrolysis, acidogenesis, acetogenesis, and finally methanogenesis. The output is biogas — chiefly methane and carbon dioxide — plus a nutrient-rich residue called digestate. Temperature, retention time, and a balanced feedstock mix are managed carefully to keep the microbial population stable and gas yield high.',
            'The biogas is then cleaned and dried so it can be burned reliably. Conditioning the gas — removing moisture, hydrogen sulphide, and other contaminants — protects the downstream engines and is the difference between a plant that runs for years and one that suffers constant breakdowns.',
          ],
        },
        {
          heading: 'Cogeneration: getting electricity and heat from one fuel',
          paragraphs: [
            'Combined Heat and Power (CHP) is what makes biogas economically compelling. A CHP engine burns the cleaned biogas to generate electricity — a plant can be configured for outputs up to 1.5 MW — while capturing the engine\'s waste heat instead of throwing it away. That recovered heat keeps the digester at its working temperature and can supply process heat to a neighbouring facility.',
            'Because CHP uses both the electrical and thermal energy in the fuel, its overall efficiency is far higher than generating power alone. For an operator, that means two revenue or savings streams from a single waste input — and a stronger case for building the plant in the first place.',
          ],
        },
        {
          heading: 'Three outputs, one circular system',
          paragraphs: [
            'A biogas cogeneration plant produces three useful streams. Electricity can power the host site or feed the grid; recovered heat can serve the digester and adjacent processes; and the digestate, once stabilised, becomes an organic fertiliser that returns nutrients to the soil and displaces synthetic alternatives.',
            'That combination is what makes biogas a genuinely circular solution rather than just a power project. Waste that would have emitted methane and required disposal instead yields clean energy, usable heat, and a soil amendment — closing the loop between agriculture, waste, and energy on a single site.',
          ],
        },
      ],
      takeaways: [
        'Anaerobic digestion captures methane that organic waste would otherwise release to the atmosphere.',
        'A plant can process up to 15,000 m³/day of organic and agricultural waste.',
        'Combined Heat and Power (CHP) configurations can reach electrical outputs up to 1.5 MW while recovering waste heat.',
        'Using both electricity and heat makes CHP far more efficient than power-only generation.',
        'The three outputs — electricity, heat, and organic fertiliser — make biogas a truly circular system.',
      ],
    },
    ar: {
      categoryLabel: 'الطاقة',
      title: 'من النفايات العضوية إلى الطاقة: كيف يعمل التوليد المشترك بالغاز الحيوي',
      excerpt:
        'النفايات العضوية والزراعية عبء حين تتعفّن في العراء، وأصل حين تُهضَم تحت السيطرة. إليك كيف يحوّل الهضم اللاهوائي مع التوليد المشترك للحرارة والطاقة ما يصل إلى 15,000 م³/يوم من النفايات إلى كهرباء وحرارة وسماد.',
      body: [
        {
          heading: 'المشكلة الكامنة في النفايات العضوية',
          paragraphs: [
            'تتشارك مخلفات تصنيع الأغذية والمنتجات الزراعية الثانوية وروث الحيوانات والجزء العضوي من النفايات البلدية في مشكلة واحدة: إذا تُركت لتتحلل في العراء أو في المدافن، فإنها تطلق الميثان مباشرة إلى الغلاف الجوي، وتجذب الآفات، وتلوّث التربة والمياه. والميثان غاز دفيئة أشد تأثيراً بكثير من ثاني أكسيد الكربون على المدى القصير، ولذلك فإن التحلل العضوي غير المنضبط مصدر إزعاج وعبء مناخي معاً.',
            'يلتقط الهضم اللاهوائي العملية البيولوجية نفسها ويضعها داخل مفاعل محكم الإغلاق. وبدلاً من أن يتسرب الميثان، يصبح وقوداً. وتستطيع محطة جيدة التغذية معالجة ما يصل إلى 15,000 م³/يوم من النفايات العضوية والزراعية، محوِّلةً مشكلة تخلص إلى مصدر مستمر للطاقة ومغذيات التربة.',
          ],
        },
        {
          heading: 'الهضم اللاهوائي خطوة بخطوة',
          paragraphs: [
            'داخل مفاعل خالٍ من الأكسجين، تفكّك مجتمعات من الكائنات الدقيقة المادة العضوية عبر التحلل المائي، وتكوين الأحماض، وتكوين الأسيتات، وأخيراً تكوين الميثان. والناتج هو الغاز الحيوي — أساساً الميثان وثاني أكسيد الكربون — إضافة إلى مخلّف غني بالمغذيات يُسمى العُصارة الهضمية. وتُدار الحرارة وزمن المكوث ومزيج اللقيم المتوازن بعناية للحفاظ على استقرار المجتمع الميكروبي وارتفاع إنتاج الغاز.',
            'ثم يُنظَّف الغاز الحيوي ويُجفَّف ليُحرَق بموثوقية. وتهيئة الغاز — بإزالة الرطوبة وكبريتيد الهيدروجين والملوثات الأخرى — تحمي المحركات اللاحقة، وهي الفارق بين محطة تعمل سنوات وأخرى تعاني أعطالاً مستمرة.',
          ],
        },
        {
          heading: 'التوليد المشترك: كهرباء وحرارة من وقود واحد',
          paragraphs: [
            'التوليد المشترك للحرارة والطاقة (CHP) هو ما يجعل الغاز الحيوي مجدياً اقتصادياً. إذ يحرق محرك CHP الغاز الحيوي المنظَّف لتوليد الكهرباء — ويمكن تهيئة المحطة لمخرجات تصل إلى 1.5 ميجاواط — مع التقاط الحرارة المهدورة للمحرك بدلاً من إهدارها. وتُبقي هذه الحرارة المستردة المفاعل عند حرارة تشغيله ويمكنها تزويد منشأة مجاورة بحرارة العمليات.',
            'ولأن التوليد المشترك يستخدم الطاقتين الكهربائية والحرارية في الوقود، فإن كفاءته الإجمالية أعلى بكثير من توليد الكهرباء وحدها. وهذا يعني للمشغّل مصدرين للإيراد أو التوفير من مدخل نفايات واحد — وحجة أقوى لبناء المحطة من الأساس.',
          ],
        },
        {
          heading: 'ثلاثة مخرجات ومنظومة دائرية واحدة',
          paragraphs: [
            'تنتج محطة التوليد المشترك بالغاز الحيوي ثلاثة تيارات مفيدة. الكهرباء يمكنها تشغيل الموقع المضيف أو تغذية الشبكة؛ والحرارة المستردة يمكنها خدمة المفاعل والعمليات المجاورة؛ والعُصارة الهضمية، بعد استقرارها، تصبح سماداً عضوياً يعيد المغذيات إلى التربة ويزيح البدائل الاصطناعية.',
            'هذا المزيج هو ما يجعل الغاز الحيوي حلاً دائرياً حقيقياً لا مجرد مشروع طاقة. فالنفايات التي كانت ستطلق الميثان وتتطلب تخلصاً تعطي بدلاً من ذلك طاقة نظيفة وحرارة قابلة للاستخدام ومحسِّناً للتربة — مغلِقةً الحلقة بين الزراعة والنفايات والطاقة في موقع واحد.',
          ],
        },
      ],
      takeaways: [
        'يلتقط الهضم اللاهوائي الميثان الذي كانت ستطلقه النفايات العضوية إلى الغلاف الجوي.',
        'يمكن للمحطة معالجة ما يصل إلى 15,000 م³/يوم من النفايات العضوية والزراعية.',
        'يمكن لتكوينات التوليد المشترك (CHP) بلوغ مخرجات كهربائية تصل إلى 1.5 ميجاواط مع استرداد الحرارة المهدورة.',
        'استخدام الكهرباء والحرارة معاً يجعل التوليد المشترك أكفأ بكثير من توليد الكهرباء وحدها.',
        'المخرجات الثلاثة — الكهرباء والحرارة والسماد العضوي — تجعل الغاز الحيوي منظومة دائرية حقيقية.',
      ],
    },
  },

  // ────────────────────────────────────────────────────────────
  // 3) ESG — LCA & EPD
  // ────────────────────────────────────────────────────────────
  'lca-epd': {
    category: 'ESG',
    icon: 'fa-recycle',
    date: { en: 'Apr 28, 2026', ar: '28 أبريل 2026' },
    readTime: { en: '7 min read', ar: 'قراءة 7 دقائق' },
    gradient: GRADIENTS.esg,
    en: {
      categoryLabel: 'ESG',
      title: 'LCA & EPD: turning product data into a market advantage',
      excerpt:
        'Buyers, regulators, and green-building schemes increasingly ask one question: what is the environmental footprint of this product? A Life Cycle Assessment answers it, and an Environmental Product Declaration turns that answer into a credential you can put on the table.',
      body: [
        {
          heading: 'Why product-level environmental data matters now',
          paragraphs: [
            'Sustainability used to be a corporate statement; increasingly it is a procurement requirement at the level of the individual product. Large customers, construction projects chasing green-building certification, and export markets all want to know the environmental performance of what they are buying — not in vague terms, but as verified numbers.',
            'For a manufacturer, this is both a threat and an opportunity. A product without credible environmental data risks being screened out of tenders; a product with a strong, transparent footprint can win them. The pair of tools that make this possible are Life Cycle Assessment (LCA) and the Environmental Product Declaration (EPD) it underpins.',
          ],
        },
        {
          heading: 'What an LCA actually measures',
          paragraphs: [
            'A Life Cycle Assessment quantifies the environmental impacts of a product across its life — from raw material extraction and manufacturing through use and end of life. The methodology is standardised by ISO 14040 and ISO 14044, which define the four phases: goal and scope definition, life-cycle inventory, impact assessment, and interpretation.',
            'Done properly, an LCA reveals where a product\'s impact actually sits. The result is often counter-intuitive: the largest contribution may come from a single raw material, an energy-intensive process step, or the use phase rather than the factory. That visibility is valuable in its own right, because it tells engineering and procurement teams exactly where a redesign or a supplier change will move the needle.',
          ],
        },
        {
          heading: 'From LCA to a verified EPD',
          paragraphs: [
            'An Environmental Product Declaration takes the LCA results and packages them into a standardised, independently verified document. Because EPDs follow common rules — including product category rules and third-party verification — the numbers from different manufacturers can be compared on a like-for-like basis. That comparability is precisely what specifiers and green-building schemes rely on.',
            'This is why manufacturers in materials-intensive sectors pursue EPDs. A polyethylene producer, for example, can use an EPD to demonstrate the footprint of its resin to downstream packaging and construction customers who are themselves under pressure to report a lower value chain impact. The EPD becomes a sales document as much as an environmental one.',
          ],
        },
        {
          heading: 'Connecting product data to corporate reporting',
          paragraphs: [
            'LCA and EPD work do not sit in isolation. The same primary data — energy use, material flows, emissions factors — feeds corporate sustainability reporting under frameworks such as the GRI Standards, and supports value-chain (Scope 3) accounting at the organisational level. Building the data infrastructure once, properly, pays off across product and corporate disclosure alike.',
            'The strategic takeaway is to treat product environmental data as an asset, not a compliance chore. Manufacturers that invest early in robust LCAs and verified EPDs build a defensible position: they can answer the buyer\'s question instantly, target their decarbonisation effort where it matters, and turn transparency into a genuine commercial advantage.',
          ],
        },
      ],
      takeaways: [
        'LCA follows ISO 14040/14044 and measures impact across the full product life cycle.',
        'An EPD turns LCA results into a standardised, third-party-verified, comparable declaration.',
        'Comparability is the point: EPDs let specifiers and green-building schemes evaluate products like-for-like.',
        'Materials manufacturers (e.g. polyethylene producers) use EPDs to win footprint-conscious customers.',
        'The same primary data also feeds GRI reporting and Scope 3 accounting — build it once, use it everywhere.',
      ],
    },
    ar: {
      categoryLabel: 'الحوكمة البيئية',
      title: 'تقييم دورة الحياة وEPD: تحويل بيانات المنتج إلى ميزة سوقية',
      excerpt:
        'يطرح المشترون والجهات التنظيمية وأنظمة المباني الخضراء سؤالاً واحداً متزايداً: ما البصمة البيئية لهذا المنتج؟ تقييم دورة الحياة يجيب عنه، وإعلان المنتج البيئي يحوّل تلك الإجابة إلى وثيقة اعتماد تضعها على الطاولة.',
      body: [
        {
          heading: 'لماذا تهمّ بيانات المنتج البيئية الآن',
          paragraphs: [
            'كانت الاستدامة بياناً مؤسسياً، وباتت اليوم شرطاً تعاقدياً على مستوى المنتج الواحد. فالعملاء الكبار، ومشروعات الإنشاء الساعية لشهادات المباني الخضراء، وأسواق التصدير، جميعها تريد معرفة الأداء البيئي لما تشتريه — لا بعبارات غامضة، بل كأرقام مُتحقَّق منها.',
            'وبالنسبة للمصنّع، هذا تهديد وفرصة معاً. فالمنتج بلا بيانات بيئية موثوقة يخاطر بالاستبعاد من المناقصات؛ والمنتج ذو البصمة القوية الشفافة يمكنه الفوز بها. والأداتان اللتان تتيحان ذلك هما تقييم دورة الحياة (LCA) وإعلان المنتج البيئي (EPD) المبني عليه.',
          ],
        },
        {
          heading: 'ما الذي يقيسه تقييم دورة الحياة فعلاً',
          paragraphs: [
            'يقيس تقييم دورة الحياة الآثار البيئية للمنتج عبر حياته — من استخراج المواد الخام والتصنيع مروراً بالاستخدام وحتى نهاية العمر. والمنهجية موحَّدة بمعياري ISO 14040 وISO 14044 اللذين يحدّدان المراحل الأربع: تعريف الهدف والنطاق، وجرد دورة الحياة، وتقييم الأثر، والتفسير.',
            'وحين يُنفَّذ بإتقان، يكشف تقييم دورة الحياة أين يقع أثر المنتج فعلاً. والنتيجة كثيراً ما تكون مخالفة للحدس: قد تأتي المساهمة الكبرى من مادة خام واحدة، أو خطوة عملية كثيفة الطاقة، أو مرحلة الاستخدام بدلاً من المصنع. وهذه الرؤية قيّمة بذاتها، إذ تخبر فرق الهندسة والمشتريات بدقة أين ستُحدث إعادة التصميم أو تغيير المورّد فرقاً حقيقياً.',
          ],
        },
        {
          heading: 'من تقييم دورة الحياة إلى EPD مُتحقَّق منه',
          paragraphs: [
            'يأخذ إعلان المنتج البيئي نتائج تقييم دورة الحياة ويصوغها في وثيقة موحَّدة مُتحقَّق منها بشكل مستقل. ولأن إعلانات EPD تتبع قواعد مشتركة — تشمل قواعد فئات المنتجات والتحقق من طرف ثالث — يمكن مقارنة أرقام مصنّعين مختلفين على أساس متكافئ. وهذه القابلية للمقارنة هي بالضبط ما يعتمد عليه واضعو المواصفات وأنظمة المباني الخضراء.',
            'ولهذا يسعى المصنّعون في القطاعات كثيفة المواد إلى إعلانات EPD. فمنتِج البولي إيثيلين مثلاً يمكنه استخدام EPD لإثبات بصمة راتنجه أمام عملاء التغليف والإنشاء اللاحقين الذين يقعون هم أنفسهم تحت ضغط الإبلاغ عن أثر أقل في سلسلة قيمتهم. فيغدو الإعلان البيئي وثيقة بيع بقدر ما هو وثيقة بيئية.',
          ],
        },
        {
          heading: 'ربط بيانات المنتج بالتقارير المؤسسية',
          paragraphs: [
            'لا تعمل أعمال LCA وEPD بمعزل. فالبيانات الأولية نفسها — استهلاك الطاقة وتدفقات المواد وعوامل الانبعاث — تغذّي تقارير الاستدامة المؤسسية وفق أطر مثل معايير GRI، وتدعم محاسبة سلسلة القيمة (النطاق الثالث) على مستوى المؤسسة. وبناء البنية البيانية مرة واحدة بإتقان يؤتي ثماره عبر الإفصاح على مستوى المنتج والمؤسسة معاً.',
            'والخلاصة الاستراتيجية هي التعامل مع بيانات المنتج البيئية كأصل لا كعبء امتثال. فالمصنّعون الذين يستثمرون مبكراً في تقييمات دورة حياة متينة وإعلانات EPD مُتحقَّق منها يبنون موقفاً قابلاً للدفاع: يجيبون عن سؤال المشتري فوراً، ويوجّهون جهد خفض الكربون حيث يهمّ، ويحوّلون الشفافية إلى ميزة تجارية حقيقية.',
          ],
        },
      ],
      takeaways: [
        'يتبع تقييم دورة الحياة معياري ISO 14040/14044 ويقيس الأثر عبر دورة حياة المنتج الكاملة.',
        'يحوّل EPD نتائج تقييم دورة الحياة إلى إعلان موحَّد مُتحقَّق منه من طرف ثالث وقابل للمقارنة.',
        'القابلية للمقارنة هي الجوهر: تتيح إعلانات EPD لواضعي المواصفات وأنظمة المباني الخضراء تقييم المنتجات على أساس متكافئ.',
        'يستخدم مصنّعو المواد (مثل منتجي البولي إيثيلين) إعلانات EPD لكسب العملاء المهتمين بالبصمة.',
        'البيانات الأولية نفسها تغذّي تقارير GRI ومحاسبة النطاق الثالث — ابنِها مرة واستخدمها في كل مكان.',
      ],
    },
  },

  // ────────────────────────────────────────────────────────────
  // 4) REGULATION — EIA in Egypt
  // ────────────────────────────────────────────────────────────
  'eia-egypt': {
    category: 'Regulation',
    icon: 'fa-scale-balanced',
    date: { en: 'Apr 9, 2026', ar: '9 أبريل 2026' },
    readTime: { en: '9 min read', ar: 'قراءة 9 دقائق' },
    gradient: GRADIENTS.regulation,
    en: {
      categoryLabel: 'Regulation',
      title: 'Environmental Impact Assessment in Egypt: a practical guide',
      excerpt:
        'Before a project breaks ground in Egypt, it usually has to pass an Environmental Impact Assessment. This is a practical walk through the legal basis, the EEAA process, and the studies that turn a permit application into an approval.',
      body: [
        {
          heading: 'The legal foundation',
          paragraphs: [
            'Environmental protection in Egypt is anchored in Law No. 4 of 1994, the country\'s framework environmental law, together with its executive regulations and subsequent amendments. The law established the Egyptian Environmental Affairs Agency (EEAA) as the competent authority and made Environmental Impact Assessment (EIA) a precondition for licensing a wide range of projects.',
            'In practice this means that for many industrial, infrastructure, and development projects, an EIA approval is not optional paperwork — it is a gate. Without it, the project cannot obtain the operating licences and permits it needs, and a weak or incomplete assessment can delay a project for months. Understanding the process early is the single most effective way to avoid that delay.',
          ],
        },
        {
          heading: 'Screening and scoping: how deep must you go?',
          paragraphs: [
            'Not every project requires the same depth of assessment. The EEAA framework screens projects by their expected level of environmental impact, which determines whether a project needs a light environmental register, a more detailed assessment, or a full EIA study. Getting this classification right at the outset sets the scope for everything that follows.',
            'Scoping then defines the boundaries of the study: which environmental and social receptors matter, which impacts are significant, and which can reasonably be set aside. A focused scope keeps the assessment proportionate — thorough where it counts, without drowning reviewers in irrelevant detail.',
          ],
        },
        {
          heading: 'Baseline, impact prediction, and mitigation',
          paragraphs: [
            'The core of an EIA is built on a baseline: a documented picture of the existing environment — air and water quality, soil, noise, biodiversity, and the surrounding community — before the project exists. Without a credible baseline, it is impossible to predict or later prove the project\'s actual effect.',
            'Against that baseline, the assessment predicts the project\'s impacts and then sets out mitigation measures to avoid, reduce, or offset them. Crucially, it also defines a monitoring programme: the parameters that will be measured during construction and operation, how often, and against what limits. Mitigation that is promised but not monitored is not credible, and reviewers know it.',
          ],
        },
        {
          heading: 'From approval to ongoing compliance',
          paragraphs: [
            'An EIA approval is the beginning of a compliance relationship, not the end of a transaction. Once operating, a facility typically maintains an environmental register that records its emissions, discharges, and waste handling, and that demonstrates ongoing conformity with the conditions attached to its industrial licence.',
            'For project developers, the practical message is to integrate the environmental workstream into the project schedule from day one — commissioning the baseline studies early, designing mitigation into the engineering rather than bolting it on, and building the monitoring and register obligations into normal operations. Treated this way, environmental compliance stops being a bottleneck and becomes a routine, well-understood part of bringing a project online.',
          ],
        },
      ],
      takeaways: [
        'Law No. 4 of 1994 is Egypt\'s framework environmental law; the EEAA is the competent authority.',
        'EIA approval is a licensing gate for many industrial and development projects — not optional paperwork.',
        'Screening sets the required depth; scoping focuses the study on the impacts that actually matter.',
        'A credible baseline plus a real monitoring programme is what makes mitigation believable to reviewers.',
        'Approval leads into ongoing obligations — environmental registers and licence-condition compliance.',
      ],
    },
    ar: {
      categoryLabel: 'تشريعات',
      title: 'تقييم الأثر البيئي في مصر: دليل عملي',
      excerpt:
        'قبل أن يبدأ أي مشروع في مصر، عليه غالباً أن يجتاز تقييم الأثر البيئي. هذا استعراض عملي للأساس القانوني، وإجراءات جهاز شؤون البيئة، والدراسات التي تحوّل طلب التصريح إلى موافقة.',
      body: [
        {
          heading: 'الأساس القانوني',
          paragraphs: [
            'ترتكز حماية البيئة في مصر على القانون رقم 4 لسنة 1994، وهو قانون البيئة الإطاري للبلاد، إلى جانب لائحته التنفيذية وتعديلاته اللاحقة. وقد أنشأ القانون جهاز شؤون البيئة المصري (EEAA) بوصفه الجهة المختصة، وجعل تقييم الأثر البيئي (EIA) شرطاً مسبقاً لترخيص نطاق واسع من المشروعات.',
            'وهذا يعني عملياً أن موافقة تقييم الأثر البيئي ليست أوراقاً اختيارية بالنسبة لكثير من المشروعات الصناعية والبنية التحتية والتطويرية — بل هي بوابة. فبدونها لا يستطيع المشروع الحصول على تراخيص التشغيل والتصاريح التي يحتاجها، ويمكن لتقييم ضعيف أو ناقص أن يؤخّر المشروع أشهراً. وفهم الإجراءات مبكراً هو الوسيلة الأنجع لتجنّب ذلك التأخير.',
          ],
        },
        {
          heading: 'الفرز وتحديد النطاق: إلى أي عمق يجب الذهاب؟',
          paragraphs: [
            'لا يتطلب كل مشروع العمق نفسه من التقييم. فإطار جهاز شؤون البيئة يفرز المشروعات بحسب مستوى أثرها البيئي المتوقع، وهو ما يحدّد ما إذا كان المشروع يحتاج سجلاً بيئياً مبسطاً، أو تقييماً أكثر تفصيلاً، أو دراسة تقييم أثر بيئي كاملة. وضبط هذا التصنيف منذ البداية يحدّد نطاق كل ما يليه.',
            'ثم يحدّد نطاق الدراسة حدودها: أي المستقبِلات البيئية والاجتماعية مهمة، وأي الآثار جوهرية، وأيها يمكن استبعاده بشكل معقول. والنطاق المركَّز يُبقي التقييم متناسباً — وافياً حيث يهمّ، دون إغراق المراجعين بتفاصيل لا صلة لها.',
          ],
        },
        {
          heading: 'خط الأساس وتوقّع الآثار وإجراءات التخفيف',
          paragraphs: [
            'يُبنى جوهر تقييم الأثر البيئي على خط أساس: صورة موثّقة للبيئة القائمة — جودة الهواء والمياه، والتربة، والضوضاء، والتنوع البيولوجي، والمجتمع المحيط — قبل وجود المشروع. وبدون خط أساس موثوق يستحيل توقّع الأثر الفعلي للمشروع أو إثباته لاحقاً.',
            'وفي مقابل خط الأساس هذا، يتوقّع التقييم آثار المشروع ثم يضع إجراءات التخفيف لتجنّبها أو خفضها أو تعويضها. والأهم أنه يحدّد كذلك برنامج رصد: المعايير التي ستُقاس خلال الإنشاء والتشغيل، ومدى تكرارها، ومقابل أي حدود. فالتخفيف الموعود دون رصد غير ذي مصداقية، والمراجعون يدركون ذلك.',
          ],
        },
        {
          heading: 'من الموافقة إلى الامتثال المستمر',
          paragraphs: [
            'موافقة تقييم الأثر البيئي هي بداية علاقة امتثال، لا نهاية معاملة. فبمجرد التشغيل، تحتفظ المنشأة عادةً بسجل بيئي يدوّن انبعاثاتها وتصريفاتها وإدارة نفاياتها، ويُثبت مطابقتها المستمرة للشروط المرفقة برخصتها الصناعية.',
            'وبالنسبة لمطوّري المشروعات، الرسالة العملية هي دمج مسار العمل البيئي في الجدول الزمني للمشروع منذ اليوم الأول — بتكليف دراسات خط الأساس مبكراً، وتصميم التخفيف ضمن الهندسة بدلاً من إضافته لاحقاً، وبناء التزامات الرصد والسجل ضمن التشغيل الاعتيادي. وبهذه الطريقة يكفّ الامتثال البيئي عن كونه عنق زجاجة ليصبح جزءاً روتينياً مفهوماً من تشغيل المشروع.',
          ],
        },
      ],
      takeaways: [
        'القانون رقم 4 لسنة 1994 هو قانون البيئة الإطاري في مصر، وجهاز شؤون البيئة هو الجهة المختصة.',
        'موافقة تقييم الأثر البيئي بوابة ترخيص لكثير من المشروعات الصناعية والتطويرية — لا أوراق اختيارية.',
        'يحدّد الفرز العمق المطلوب، ويركّز تحديد النطاق الدراسة على الآثار التي تهمّ فعلاً.',
        'خط أساس موثوق مع برنامج رصد حقيقي هو ما يجعل التخفيف مقنعاً للمراجعين.',
        'تقود الموافقة إلى التزامات مستمرة — السجلات البيئية والامتثال لشروط الترخيص.',
      ],
    },
  },

  // ────────────────────────────────────────────────────────────
  // 5) CIRCULAR ECONOMY — MSW to RDF
  // ────────────────────────────────────────────────────────────
  'circular-economy-rdf': {
    category: 'Circular Economy',
    icon: 'fa-arrows-spin',
    date: { en: 'Mar 24, 2026', ar: '24 مارس 2026' },
    readTime: { en: '7 min read', ar: 'قراءة 7 دقائق' },
    gradient: GRADIENTS.circular,
    en: {
      categoryLabel: 'Circular Economy',
      title: 'Closing the loop: turning municipal waste into RDF',
      excerpt:
        'A city\'s waste stream is full of energy that usually ends up in landfill. With the right sorting and processing, municipal solid waste can be converted into Refuse-Derived Fuel — diverting waste from landfill and feeding energy-intensive industry.',
      body: [
        {
          heading: 'The municipal waste challenge',
          paragraphs: [
            'Municipal Solid Waste (MSW) is one of the most visible sustainability problems a growing economy faces. As populations and consumption rise, so does the volume of mixed household and commercial waste — and the default destination, landfill, consumes land, generates methane, and risks polluting soil and groundwater.',
            'Yet a large fraction of that waste is not really rubbish: it is paper, plastics, textiles, and other combustible materials with real calorific value. The circular-economy question is how to extract that value instead of burying it. A modern materials and energy recovery system can process up to 1,000 t/day of municipal waste, turning a disposal problem into a feedstock.',
          ],
        },
        {
          heading: 'Inside a Material Recovery Facility',
          paragraphs: [
            'The work begins at a Material Recovery Facility (MRF). Incoming mixed waste is mechanically and manually separated into streams: recyclable metals and certain plastics are recovered for sale, organics are diverted for treatment, and inert or hazardous fractions are removed. What remains is a high-calorific combustible fraction.',
            'The sorting stage is what determines the quality of everything downstream. A well-run MRF maximises the recovery of genuinely recyclable material first — keeping it in the loop at its highest value — and only then routes the residual combustible fraction toward fuel production. Recycling and energy recovery are complementary, not competing.',
          ],
        },
        {
          heading: 'Producing Refuse-Derived Fuel',
          paragraphs: [
            'The combustible residual is then processed into Refuse-Derived Fuel (RDF): shredded to a consistent size, dried to lower its moisture, and sometimes pelletised so it can be handled and burned like a conventional fuel. The aim is a homogeneous product with a predictable calorific value and controlled contaminant levels.',
            'That consistency is what makes RDF useful to industry. Energy-intensive sectors such as cement can co-process RDF in their kilns to substitute a share of fossil fuel, lowering both their fuel costs and the Scope 1 emissions associated with virgin coal or petcoke. The waste that a city wanted to be rid of becomes an input to industrial production.',
          ],
        },
        {
          heading: 'Why this closes the loop',
          paragraphs: [
            'Diverting waste from landfill delivers a stack of benefits at once: it extends the life of scarce landfill capacity, avoids the methane that buried organics would have generated, and displaces fossil fuel in the industries that take the RDF. Recovered recyclables re-enter manufacturing, and the residual energy is put to work rather than wasted.',
            'This is the circular economy in concrete form. Material that would have been a one-way trip to landfill is instead split into recyclables, energy, and a much smaller residual — keeping resources in use for as long as possible and turning a municipal liability into industrial value.',
          ],
        },
      ],
      takeaways: [
        'A materials and energy recovery system can process up to 1,000 t/day of municipal solid waste.',
        'A Material Recovery Facility (MRF) separates recyclables, organics, and a high-calorific combustible fraction.',
        'Recycling comes first; only the residual combustible fraction is routed to fuel production.',
        'RDF is shredded, dried, and sized into a consistent fuel that industries such as cement can co-process.',
        'The result diverts waste from landfill, avoids methane, and displaces fossil fuel — a closed loop.',
      ],
    },
    ar: {
      categoryLabel: 'الاقتصاد الدائري',
      title: 'إغلاق الحلقة: تحويل النفايات البلدية إلى وقود RDF',
      excerpt:
        'مجرى نفايات المدينة مليء بطاقة تنتهي عادةً في المدافن. ومع الفرز والمعالجة الصحيحين، يمكن تحويل النفايات الصلبة البلدية إلى وقود مشتق من النفايات — يحوّل النفايات بعيداً عن المدافن ويغذّي الصناعات كثيفة الطاقة.',
      body: [
        {
          heading: 'تحدّي النفايات البلدية',
          paragraphs: [
            'النفايات الصلبة البلدية (MSW) من أبرز مشكلات الاستدامة التي يواجهها أي اقتصاد نامٍ. فمع تزايد السكان والاستهلاك يتزايد حجم النفايات المنزلية والتجارية المختلطة — والوجهة الافتراضية، المدافن، تستهلك الأرض وتولّد الميثان وتهدّد بتلويث التربة والمياه الجوفية.',
            'ومع ذلك، فإن حصة كبيرة من تلك النفايات ليست قمامة حقاً: بل ورق وبلاستيك ومنسوجات ومواد قابلة للاحتراق ذات قيمة حرارية حقيقية. والسؤال في الاقتصاد الدائري هو كيف نستخلص تلك القيمة بدلاً من دفنها. وتستطيع منظومة حديثة لاسترداد المواد والطاقة معالجة ما يصل إلى 1,000 طن/يوم من النفايات البلدية، محوِّلةً مشكلة تخلص إلى لقيم.',
          ],
        },
        {
          heading: 'داخل منشأة استرداد المواد',
          paragraphs: [
            'يبدأ العمل في منشأة استرداد المواد (MRF). إذ تُفصَل النفايات المختلطة الواردة آلياً ويدوياً إلى تيارات: تُستردّ المعادن وبعض أنواع البلاستيك القابلة لإعادة التدوير للبيع، وتُحوَّل المواد العضوية للمعالجة، وتُزال الكسور الخاملة أو الخطرة. وما يتبقّى هو كسر قابل للاحتراق عالي القيمة الحرارية.',
            'مرحلة الفرز هي ما يحدّد جودة كل ما يليها. فالمنشأة الجيدة الإدارة تُعظّم أولاً استرداد المواد القابلة لإعادة التدوير فعلاً — مُبقيةً إياها في الحلقة عند أعلى قيمة — ثم توجّه الكسر القابل للاحتراق المتبقي نحو إنتاج الوقود. فإعادة التدوير واسترداد الطاقة متكاملان لا متنافسان.',
          ],
        },
        {
          heading: 'إنتاج الوقود المشتق من النفايات',
          paragraphs: [
            'ثم يُعالَج الكسر القابل للاحتراق المتبقي ليصبح وقوداً مشتقاً من النفايات (RDF): يُفرَم إلى حجم متجانس، ويُجفَّف لخفض رطوبته، ويُكبَّس أحياناً ليُتداوَل ويُحرَق كوقود تقليدي. والهدف منتج متجانس بقيمة حرارية متوقعة ومستويات ملوثات مضبوطة.',
            'هذا التجانس هو ما يجعل وقود RDF مفيداً للصناعة. فالقطاعات كثيفة الطاقة مثل الأسمنت يمكنها المعالجة المشتركة لوقود RDF في أفرانها لإحلال حصة من الوقود الأحفوري، ما يخفض كلفة الوقود وانبعاثات النطاق الأول المرتبطة بالفحم أو فحم البترول البكر. فالنفايات التي أرادت المدينة التخلص منها تصبح مدخلاً للإنتاج الصناعي.',
          ],
        },
        {
          heading: 'لماذا يُغلق هذا الحلقة',
          paragraphs: [
            'تحويل النفايات بعيداً عن المدافن يحقّق جملة فوائد دفعة واحدة: يُطيل عمر سعة المدافن الشحيحة، ويتجنّب الميثان الذي كانت ستولّده المواد العضوية المدفونة، ويُزيح الوقود الأحفوري في الصناعات التي تتلقى وقود RDF. وتعود المواد المُعاد تدويرها إلى التصنيع، وتُسخَّر الطاقة المتبقية بدلاً من إهدارها.',
            'هذا هو الاقتصاد الدائري بشكله الملموس. فالمادة التي كانت ستذهب رحلة بلا عودة إلى المدفن تُقسَّم بدلاً من ذلك إلى مواد قابلة لإعادة التدوير، وطاقة، ومتبقٍ أصغر بكثير — مُبقيةً الموارد قيد الاستخدام أطول مدة ممكنة ومحوِّلةً عبئاً بلدياً إلى قيمة صناعية.',
          ],
        },
      ],
      takeaways: [
        'يمكن لمنظومة استرداد المواد والطاقة معالجة ما يصل إلى 1,000 طن/يوم من النفايات الصلبة البلدية.',
        'تفصل منشأة استرداد المواد (MRF) المواد القابلة لإعادة التدوير والعضوية والكسر القابل للاحتراق عالي القيمة الحرارية.',
        'إعادة التدوير أولاً؛ ولا يُوجَّه إلى إنتاج الوقود إلا الكسر القابل للاحتراق المتبقي.',
        'يُفرَم وقود RDF ويُجفَّف ويُحدَّد حجمه ليصبح وقوداً متجانساً تستطيع صناعات مثل الأسمنت معالجته مشتركاً.',
        'النتيجة تحوّل النفايات بعيداً عن المدافن، وتتجنّب الميثان، وتُزيح الوقود الأحفوري — حلقة مغلقة.',
      ],
    },
  },

  // ────────────────────────────────────────────────────────────
  // 6) CARBON — Decarbonization & carbon capture
  // ────────────────────────────────────────────────────────────
  'decarbonization-carbon-capture': {
    category: 'Carbon',
    icon: 'fa-industry',
    date: { en: 'Mar 6, 2026', ar: '6 مارس 2026' },
    readTime: { en: '8 min read', ar: 'قراءة 8 دقائق' },
    gradient: GRADIENTS.carbon,
    en: {
      categoryLabel: 'Carbon',
      title: 'A decarbonization roadmap for industry',
      excerpt:
        'Net-zero targets are easy to announce and hard to deliver. A credible industrial decarbonisation roadmap starts with measurement, sequences the cheapest abatement first, and keeps carbon capture for the emissions that genuinely cannot be eliminated.',
      body: [
        {
          heading: 'You cannot reduce what you have not measured',
          paragraphs: [
            'Every credible decarbonisation effort begins with carbon footprint accounting. Before setting a target, an industrial operator needs a verified inventory of its greenhouse-gas emissions — direct emissions from its own processes and combustion (Scope 1), purchased energy (Scope 2), and the wider value chain (Scope 3). Without that baseline, a net-zero pledge is a number with nothing underneath it.',
            'A robust inventory does more than satisfy disclosure requirements. It shows where emissions actually originate, how large each source is, and which ones the operator can influence directly. That diagnosis is what turns a vague ambition into a roadmap with priorities.',
          ],
        },
        {
          heading: 'Sequencing the abatement: a strategy, not a wish list',
          paragraphs: [
            'A decarbonisation strategy orders the available levers by cost and impact rather than treating them as a single leap to zero. Energy efficiency usually comes first because it often pays for itself; switching to lower-carbon or renewable energy follows; then process changes, electrification, and alternative fuels such as Refuse-Derived Fuel address the harder, more capital-intensive emissions.',
            'Sequencing matters because capital and management attention are finite. A roadmap that captures the cheap, fast wins early builds momentum and frees up budget for the heavier interventions later. The output is a staged pathway — with dates, owners, and expected reductions — that finance and operations teams can actually commit to.',
          ],
        },
        {
          heading: 'Carbon capture for the hard-to-abate remainder',
          paragraphs: [
            'Some industrial emissions are intrinsic to the chemistry and cannot be eliminated by efficiency or fuel switching alone. For that residual, carbon capture becomes relevant: separating CO₂ from process or flue-gas streams so it can be used or stored rather than released. It is best understood as the tool for what is left after every cheaper option has been exhausted, not as a first move.',
            'Captured CO₂ need not be a dead-end cost. It can become a feedstock — the basis for products such as Blue Ethanol and other Blue Fuels, where captured carbon is converted into usable fuels and chemicals. This turns part of an emissions problem into a product stream, improving the economics of capture and aligning it with a circular view of carbon.',
          ],
        },
        {
          heading: 'Building the capability to sustain it',
          paragraphs: [
            'A roadmap only delivers if the organisation can execute it year after year. That requires internal capability: people who understand greenhouse-gas accounting, the relevant standards, and the operational changes a decarbonisation plan demands. Training and capacity-building are what embed the strategy in the organisation rather than leaving it as a consultant\'s report on a shelf.',
            'The overall message is one of sequence and discipline. Measure first, build a costed and staged strategy, deploy carbon capture where it genuinely belongs, and invest in the people who will run the programme. Done in that order, decarbonisation becomes an operational programme an industrial business can deliver — not a slogan it merely announces.',
          ],
        },
      ],
      takeaways: [
        'Carbon footprint accounting across Scopes 1, 2, and 3 is the non-negotiable starting point.',
        'A decarbonisation strategy sequences levers by cost and impact — efficiency and energy first, then the hard stuff.',
        'Carbon capture is for the hard-to-abate residual, not a substitute for cheaper reductions.',
        'Captured CO₂ can feed Blue Ethanol and other Blue Fuels, turning an emission into a product.',
        'Training and capacity-building are what let an organisation actually sustain the roadmap.',
      ],
    },
    ar: {
      categoryLabel: 'الكربون',
      title: 'خارطة طريق خفض الكربون للصناعة',
      excerpt:
        'أهداف الحياد الكربوني سهلة الإعلان وصعبة التحقيق. خارطة طريق صناعية موثوقة لخفض الكربون تبدأ بالقياس، وترتّب أرخص أدوات الخفض أولاً، وتُبقي احتجاز الكربون للانبعاثات التي يتعذّر إزالتها فعلاً.',
      body: [
        {
          heading: 'لا يمكنك خفض ما لم تقِسه',
          paragraphs: [
            'يبدأ كل جهد موثوق لخفض الكربون بحساب البصمة الكربونية. فقبل تحديد هدف، يحتاج المشغّل الصناعي إلى جرد مُتحقَّق منه لانبعاثاته من الغازات الدفيئة — الانبعاثات المباشرة من عملياته واحتراقه (النطاق الأول)، والطاقة المشتراة (النطاق الثاني)، وسلسلة القيمة الأوسع (النطاق الثالث). وبدون خط الأساس هذا، يبقى تعهّد الحياد الكربوني رقماً بلا أساس.',
            'والجرد المتين يفعل أكثر من تلبية متطلبات الإفصاح. فهو يُظهر من أين تنشأ الانبعاثات فعلاً، وحجم كل مصدر، وأيها يستطيع المشغّل التأثير فيه مباشرة. وهذا التشخيص هو ما يحوّل طموحاً غامضاً إلى خارطة طريق ذات أولويات.',
          ],
        },
        {
          heading: 'ترتيب الخفض: استراتيجية لا قائمة أمنيات',
          paragraphs: [
            'ترتّب استراتيجية خفض الكربون الأدوات المتاحة بحسب الكلفة والأثر بدلاً من معاملتها كقفزة واحدة إلى الصفر. وعادةً تأتي كفاءة الطاقة أولاً لأنها كثيراً ما تسدّد كلفتها بنفسها؛ ثم يليها التحول إلى طاقة منخفضة الكربون أو متجددة؛ ثم تعالج تغييرات العمليات والكهربة والوقود البديل مثل الوقود المشتق من النفايات الانبعاثات الأصعب والأكثر كثافة رأسمالية.',
            'والترتيب مهم لأن رأس المال واهتمام الإدارة محدودان. فخارطة الطريق التي تلتقط المكاسب الرخيصة السريعة مبكراً تبني زخماً وتحرّر ميزانية للتدخلات الأثقل لاحقاً. والناتج مسار مرحلي — بمواعيد ومسؤولين وتخفيضات متوقعة — يمكن لفرق المالية والتشغيل الالتزام به فعلاً.',
          ],
        },
        {
          heading: 'احتجاز الكربون للمتبقّي صعب الخفض',
          paragraphs: [
            'بعض الانبعاثات الصناعية متأصلة في الكيمياء ولا يمكن إزالتها بالكفاءة أو تبديل الوقود وحدهما. ولهذا المتبقّي يصبح احتجاز الكربون ذا صلة: فصل ثاني أكسيد الكربون من تيارات العمليات أو غازات المداخن لاستخدامه أو تخزينه بدلاً من إطلاقه. ويُفهَم على أفضل وجه بوصفه أداة لما تبقّى بعد استنفاد كل خيار أرخص، لا خطوة أولى.',
            'وثاني أكسيد الكربون المحتجَز ليس بالضرورة كلفة بلا مردود. فيمكن أن يصبح لقيماً — أساساً لمنتجات مثل البلو إيثانول وأنواع البلو فيول الأخرى، حيث يُحوَّل الكربون المحتجَز إلى وقود ومواد كيميائية قابلة للاستخدام. وهذا يحوّل جزءاً من مشكلة الانبعاثات إلى تيار منتجات، فيحسّن اقتصاديات الاحتجاز ويوائمه مع رؤية دائرية للكربون.',
          ],
        },
        {
          heading: 'بناء القدرة على الاستمرار',
          paragraphs: [
            'لا تؤتي خارطة الطريق ثمارها إلا إذا استطاعت المؤسسة تنفيذها عاماً بعد عام. وهذا يتطلب قدرة داخلية: أشخاصاً يفهمون محاسبة الغازات الدفيئة، والمعايير ذات الصلة، والتغييرات التشغيلية التي تتطلبها خطة خفض الكربون. والتدريب وبناء القدرات هما ما يرسّخ الاستراتيجية في المؤسسة بدلاً من تركها تقريراً استشارياً على الرف.',
            'والرسالة الإجمالية هي رسالة تسلسل وانضباط. قِس أولاً، وابنِ استراتيجية مكلَّفة ومرحلية، وانشر احتجاز الكربون حيث ينتمي فعلاً، واستثمر في الأشخاص الذين سيديرون البرنامج. وبهذا الترتيب يصبح خفض الكربون برنامجاً تشغيلياً يمكن لمنشأة صناعية تنفيذه — لا شعاراً تكتفي بإعلانه.',
          ],
        },
      ],
      takeaways: [
        'حساب البصمة الكربونية عبر النطاقات الأول والثاني والثالث هو نقطة البداية غير القابلة للتفاوض.',
        'ترتّب استراتيجية خفض الكربون الأدوات بحسب الكلفة والأثر — الكفاءة والطاقة أولاً ثم الأصعب.',
        'احتجاز الكربون للمتبقّي صعب الخفض، لا بديلاً عن تخفيضات أرخص.',
        'يمكن لثاني أكسيد الكربون المحتجَز أن يغذّي البلو إيثانول وأنواع البلو فيول، فيحوّل الانبعاث إلى منتج.',
        'التدريب وبناء القدرات هما ما يمكّن المؤسسة فعلاً من الاستمرار في خارطة الطريق.',
      ],
    },
  },
}

/** Canonical category labels per locale, used for the listing filter chips. */
export const INSIGHT_CATEGORY_LABELS: Record<
  Locale,
  Record<InsightEntry['category'], string>
> = {
  en: {
    Water: 'Water',
    Energy: 'Energy',
    ESG: 'ESG',
    Regulation: 'Regulation',
    'Circular Economy': 'Circular Economy',
    Carbon: 'Carbon',
  },
  ar: {
    Water: 'المياه',
    Energy: 'الطاقة',
    ESG: 'الحوكمة البيئية',
    Regulation: 'تشريعات',
    'Circular Economy': 'الاقتصاد الدائري',
    Carbon: 'الكربون',
  },
}
