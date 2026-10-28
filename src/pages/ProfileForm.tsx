import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { UploadField } from '@/components/UploadField'
import type { User } from '@/lib/api'

export type ProfileFormValues = {
  name: string
  headline: string
  bio: string
  avatar_url: string
  website_url: string
  linkedin_url: string
  youtube_url: string
  github_url: string
}

type Props = {
  profile: User
  instructorSlug?: string
  saving: boolean
  message: string
  onSubmit: (fields: ProfileFormValues) => void
}

const HEADLINE_MAX = 160

export function ProfileForm({ profile, instructorSlug, saving, message, onSubmit }: Props) {
  const { t } = useTranslation()
  const isInstructor = profile.role === 'instructor' || profile.role === 'admin'

  const [name, setName] = useState(profile.name)
  const [headline, setHeadline] = useState(profile.headline ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(profile.website_url ?? '')
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedin_url ?? '')
  const [youtubeUrl, setYoutubeUrl] = useState(profile.youtube_url ?? '')
  const [githubUrl, setGithubUrl] = useState(profile.github_url ?? '')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          name,
          headline,
          bio,
          avatar_url: avatarUrl,
          website_url: websiteUrl,
          linkedin_url: linkedinUrl,
          youtube_url: youtubeUrl,
          github_url: githubUrl,
        })
      }}
      className="space-y-5 rounded border border-border bg-surface p-6"
    >
      {isInstructor && instructorSlug && (
        <p className="text-sm text-muted">
          {t('instructor.publicProfileLink')}{' '}
          <Link to={`/instructor/${instructorSlug}`} className="font-semibold text-primary hover:underline">
            /instructor/{instructorSlug}
          </Link>
        </p>
      )}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          value={profile.email}
          disabled
          className="w-full rounded border border-border bg-bg px-3 py-2.5 text-muted"
        />
      </div>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-semibold">
          Full name
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="headline" className="mb-1 block text-sm font-semibold">
          Headline
        </label>
        <input
          id="headline"
          value={headline}
          maxLength={HEADLINE_MAX}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="e.g. Full Stack Developer"
          className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
        />
        <p className="mt-1 text-xs text-muted">
          {headline.length}/{HEADLINE_MAX}
        </p>
      </div>
      <div>
        <label htmlFor="bio" className="mb-1 block text-sm font-semibold">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="avatar" className="mb-1 block text-sm font-semibold">
          Avatar
        </label>
        <div className="flex flex-col gap-2">
          <UploadField
            category="image"
            accept="image/*"
            label="Upload avatar"
            onUploaded={(file) => setAvatarUrl(file.url ?? '')}
          />
          <input
            id="avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Or paste image URL"
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
      </div>
      {isInstructor && (
        <fieldset className="space-y-4 border-t border-border pt-4">
          <legend className="text-sm font-bold">{t('instructor.socialLinks')}</legend>
          <div>
            <label htmlFor="website" className="mb-1 block text-sm font-semibold">
              Website
            </label>
            <input
              id="website"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://"
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="linkedin" className="mb-1 block text-sm font-semibold">
              LinkedIn
            </label>
            <input
              id="linkedin"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="youtube" className="mb-1 block text-sm font-semibold">
              YouTube
            </label>
            <input
              id="youtube"
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/@..."
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="github" className="mb-1 block text-sm font-semibold">
              GitHub
            </label>
            <input
              id="github"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
            />
          </div>
        </fieldset>
      )}
      {message && (
        <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="rounded bg-primary px-4 py-2.5 font-bold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        Save changes
      </button>
    </form>
  )
}
