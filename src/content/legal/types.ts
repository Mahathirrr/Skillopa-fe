export type LegalSection = {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export type LegalDocument = {
  lastUpdated: string
  title: string
  description: string
  sections: LegalSection[]
}
