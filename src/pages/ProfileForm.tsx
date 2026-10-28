import { useState } from 'react'

import { UploadField } from '@/components/UploadField'
import type { User } from '@/lib/api'

type Props = {
  profile: User
  saving: boolean
  message: string
  onSubmit: (fields: { name: string; headline: string; bio: string; avatar_url: string }) => void
}

export function ProfileForm({ profile, saving, message, onSubmit }: Props) {
  const [name, setName] = useState(profile.name)
  const [headline, setHeadline] = useState(profile.headline ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ name, headline, bio, avatar_url: avatarUrl })
      }}
      className="space-y-5 rounded border border-border bg-surface p-6"
    >
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
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="e.g. Full Stack Developer"
          className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="bio" className="mb-1 block text-sm font-semibold">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
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
