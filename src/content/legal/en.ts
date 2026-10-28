import type { LegalDocument } from '@/content/legal/types'

export const LEGAL_LAST_UPDATED_EN = 'October 28, 2026'

export const termsDocumentEn: LegalDocument = {
  lastUpdated: LEGAL_LAST_UPDATED_EN,
  title: 'Terms of Service',
  description: 'Rules for using the Skillopa online learning platform as a student, instructor, or visitor.',
  sections: termsDocumentEnSections(),
}

function termsDocumentEnSections(): LegalDocument['sections'] {
  return [
    {
      id: 'introduction',
      title: '1. Introduction',
      paragraphs: [
        'These Terms of Service ("Terms") govern use of Skillopa ("Service") at skillopa.showcaseproject.my.id and related domains.',
        'By registering, signing in, enrolling, or using the Service, you agree to these Terms and the Skillopa Privacy Policy.',
      ],
    },
    {
      id: 'definitions',
      title: '2. Definitions',
      paragraphs: ['In these Terms:'],
      bullets: [
        'Student: a user who takes courses, completes quizzes, and may earn certificates.',
        'Instructor: a user who creates and publishes course content.',
        'Course: learning materials (video, text, quizzes, assignments) on the platform.',
        'Certificate: proof of completion issued by Skillopa under course and verification rules.',
      ],
    },
    {
      id: 'account',
      title: '3. Account and security',
      paragraphs: [
        'Provide accurate registration information and keep your password confidential.',
        'You are responsible for activity on your account. Contact us if you notice unauthorized access.',
        'We may suspend or close accounts for violations, abuse, or legal obligations.',
        'OAuth sign-in (e.g. Google) is also subject to the provider’s policies.',
      ],
    },
    {
      id: 'service',
      title: '4. Scope of service',
      paragraphs: [
        'Skillopa offers course catalogs, online learning, certificates, checkout, wishlist, affiliate features, and other in-app capabilities.',
        'Course content may change over time. We strive for quality but do not guarantee error-free materials.',
        'An internet connection is required for most features.',
      ],
    },
    {
      id: 'payments',
      title: '5. Paid courses and payments',
      paragraphs: [
        'Prices follow checkout information. Payments are processed by secure third-party providers (e.g. Mayar).',
        'Paid content access is granted after validated payment.',
        'Refund rules, if any, follow checkout terms or official support requests.',
      ],
    },
    {
      id: 'content',
      title: '6. Content and copyright',
      paragraphs: [
        'Course materials are protected by copyright. You may not redistribute or resell content without permission.',
        'Instructors warrant they have rights to uploaded materials and grant Skillopa an operational license to host them.',
        'User reviews and Q&A may be moderated.',
      ],
    },
    {
      id: 'certificates',
      title: '7. Certificates',
      paragraphs: [
        'Certificates are issued when course completion requirements are met.',
        'Each certificate has a public verification code. Forgery or tampering is prohibited.',
        'Certificate names follow your profile — use your real name if certificates matter for formal use.',
      ],
    },
    {
      id: 'prohibited',
      title: '8. Prohibited use',
      paragraphs: ['You agree not to:'],
      bullets: [
        'Abuse accounts, coupons, or affiliate programs.',
        'Upload malware, spam, or illegal content.',
        'Access systems or other users’ data without authorization.',
        'Impersonate Skillopa staff or instructors.',
      ],
    },
    {
      id: 'privacy',
      title: '9. Personal data',
      paragraphs: ['Processing is described in the Skillopa Privacy Policy, which forms part of this agreement.'],
    },
    {
      id: 'liability',
      title: '10. Limitation of liability',
      paragraphs: [
        'The Service is provided "as is" to the extent permitted by law.',
        'Skillopa is not a substitute for official professional licensing unless explicitly stated by a partner institution.',
        'Our liability is limited as allowed under Indonesian law.',
      ],
    },
    {
      id: 'changes',
      title: '11. Changes to Terms',
      paragraphs: [
        'We may update these Terms. The "Last updated" date will change on this page. Continued use after changes constitutes acceptance unless law requires otherwise.',
      ],
    },
    {
      id: 'law',
      title: '12. Governing law',
      paragraphs: [
        'These Terms are governed by the laws of Indonesia. Disputes are resolved amicably first, then through competent courts in Indonesia.',
      ],
    },
  ]
}

export const privacyDocumentEn: LegalDocument = {
  lastUpdated: LEGAL_LAST_UPDATED_EN,
  title: 'Privacy Policy',
  description: 'How Skillopa collects, uses, stores, and protects personal data.',
  sections: [
    {
      id: 'introduction',
      title: '1. Introduction',
      paragraphs: [
        'This Privacy Policy explains our data practices when you use Skillopa.',
        'It aligns with Indonesian personal data protection principles, including Law No. 27 of 2022 (PDP Law).',
      ],
    },
    {
      id: 'controller',
      title: '2. Data controller',
      paragraphs: [
        'The operator of skillopa.showcaseproject.my.id acts as controller for account and platform data.',
      ],
    },
    {
      id: 'data',
      title: '3. Data we collect',
      paragraphs: ['Categories may include:'],
      bullets: [
        'Account: name, email, password hash, profile photo, role, locale.',
        'Learning: progress, notes, bookmarks, quiz results, assignments, certificates.',
        'Transactions: orders, payment status, payment provider identifiers (not full card numbers on our servers).',
        'Communication: Q&A, reviews, notifications.',
        'Technical: IP, access logs, session cookies, device/browser data.',
        'OAuth: identity from Google/GitHub when you use those sign-in options.',
      ],
    },
    {
      id: 'purposes',
      title: '4. Purposes',
      paragraphs: ['We process data to:'],
      bullets: [
        'Provide, secure, and improve learning services.',
        'Handle enrollments, payments, and certificates.',
        'Send transactional email (e.g. password reset).',
        'Prevent fraud and abuse.',
        'Meet legal obligations.',
      ],
    },
    {
      id: 'sharing',
      title: '5. Third parties',
      paragraphs: ['We do not sell personal data. Limited sharing with:'],
      bullets: [
        'Hosting, database, email (e.g. Resend), and CDN providers.',
        'Payment processors.',
        'OAuth providers when you use them.',
        'Embedded video providers (e.g. YouTube) when you play lessons.',
        'Authorities when required by law.',
      ],
    },
    {
      id: 'retention',
      title: '6. Retention',
      paragraphs: [
        'Data is kept while your account is active and as needed for operations, audit, or law.',
        'You may request deletion via support. Some logs may be retained briefly for security.',
      ],
    },
    {
      id: 'rights',
      title: '7. Your rights',
      paragraphs: [
        'You may request access, correction, deletion, or restriction under the PDP Law.',
        'Contact us using the email on the legal pages.',
      ],
    },
    {
      id: 'security',
      title: '8. Security',
      paragraphs: [
        'We use HTTPS, password hashing, role-based access, and reasonable safeguards.',
        'Report suspected breaches promptly.',
      ],
    },
    {
      id: 'minors',
      title: '9. Minors',
      paragraphs: [
        'The Service is intended for users who meet applicable minimum age requirements. Parental consent may be required where local law applies.',
      ],
    },
    {
      id: 'changes',
      title: '10. Policy changes',
      paragraphs: [
        'We may update this policy. Material changes will be reflected by the date on this page or in-app notice when appropriate.',
      ],
    },
  ],
}
