import { privacyDocumentEn, termsDocumentEn } from '@/content/legal/en'
import { privacyDocumentId, termsDocumentId } from '@/content/legal/id'
import type { LegalDocument } from '@/content/legal/types'

export function getTermsDocument(language: string): LegalDocument {
  return language.startsWith('id') ? termsDocumentId : termsDocumentEn
}

export function getPrivacyDocument(language: string): LegalDocument {
  return language.startsWith('id') ? privacyDocumentId : privacyDocumentEn
}
