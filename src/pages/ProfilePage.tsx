import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ProfileForm } from '@/pages/ProfileForm'
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

  const updateMutation = useMutation({
    mutationFn: (fields: { name: string; headline: string; bio: string; avatar_url: string }) =>
      api.updateProfile(token!, fields),
    onSuccess: (res) => {
      setUser(res.user)
      setMessage('Profile updated successfully')
    },
    onError: (e) => {
      setMessage(e instanceof ApiError ? e.message : 'Update failed')
    },
  })

  if (isLoading && !profile) return <LoadingSpinner />

  if (!profile) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-6">
      <h1 className="mb-6 text-3xl font-bold">Profile settings</h1>
      <ProfileForm
        key={profile.id}
        profile={profile}
        saving={updateMutation.isPending}
        message={message}
        onSubmit={(fields) => updateMutation.mutate(fields)}
      />
    </div>
  )
}
