// Expert specialization catalogue. Keys align with ExpertCase.category values
// so we can rank experts by specialization overlap with a case's topic.
export const SPECIALIZATIONS: { key: string; labelAr: string }[] = [
  { key: 'compliance', labelAr: 'الامتثال البيئي' },
  { key: 'eia', labelAr: 'تقييم الأثر البيئي' },
  { key: 'waste', labelAr: 'إدارة النفايات' },
  { key: 'emissions', labelAr: 'الانبعاثات' },
  { key: 'water', labelAr: 'إدارة المياه' },
  { key: 'permits', labelAr: 'التراخيص والموافقات' },
  { key: 'energy', labelAr: 'تدقيق الطاقة' },
  { key: 'legal', labelAr: 'قانوني / مخالفات' },
]

export const SPECIALIZATION_LABELS: Record<string, string> = Object.fromEntries(
  SPECIALIZATIONS.map((s) => [s.key, s.labelAr]),
)

/** True when an expert's specializations overlap a case category. */
export function expertMatchesCategory(specializations: string[], category: string | null): boolean {
  if (!category) return false
  return specializations.includes(category)
}
