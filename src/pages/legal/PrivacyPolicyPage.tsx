import { useTranslation } from 'react-i18next'

import { LegalDocumentPage } from '@/components/legal/LegalDocumentPage'
import { getPrivacyDocument } from '@/content/legal'

export function PrivacyPolicyPage() {
  const { i18n } = useTranslation()
  const document = getPrivacyDocument(i18n.language)
  return <LegalDocumentPage document={document} />
}
