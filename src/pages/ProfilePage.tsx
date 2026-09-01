import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth'

export function ProfilePage() {
  const { token, user, setUser } = useAuthStore()
  const [message, setMessage] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(token!),
    enabled: !!token,
  })

  const profile = data?.user ?? user

  const [name, setName] = useState('')
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (!profile) return
    setName(profile.name)
    setHeadline(profile.headline ?? '')
    setBio(profile.bio ?? '')
    setAvatarUrl(profile.avatar_url ?? '')
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: () =>
      api.updateProfile(token!, { name, headline, bio, avatar_url: avatarUrl }),
    onSuccess: (res) => {
      setUser(res.user)
      setMessage('Profile updated successfully')
    },
    onError: (e) => {
      setMessage(e instanceof ApiError ? e.message : 'Update failed')
    },
  })

  if (isLoading && !profile) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-6">
      <h1 className="mb-6 text-3xl font-bold">Profile settings</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          updateMutation.mutate()
        }}
        className="space-y-5 rounded border border-border bg-surface p-6"
      >
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            value={profile?.email ?? ''}
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
            Avatar URL
          </label>
          <input
            id="avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded border border-border px-3 py-2.5 outline-none focus:border-primary"
          />
        </div>
        {message && (
          <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="rounded bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
