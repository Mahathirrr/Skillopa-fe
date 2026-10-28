import { useTranslation } from 'react-i18next'

import { LegalDocumentPage } from '@/components/legal/LegalDocumentPage'
import { getTermsDocument } from '@/content/legal'

export function TermsOfServicePage() {
  const { i18n } = useTranslation()
  const document = getTermsDocument(i18n.language)
  return <LegalDocumentPage document={document} />
}
