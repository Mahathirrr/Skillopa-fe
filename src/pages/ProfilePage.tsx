import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ProfileForm, type ProfileFormValues } from '@/pages/ProfileForm'
import { api } from '@/lib/api'
import type { User } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth'

export function ProfilePage() {
  const { token, user, setUser } = useAuthStore()
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin'

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(token!),
    enabled: !!token,
  })

  const { data: instructorData } = useQuery({
    queryKey: ['instructor-profile-self', user?.id],
    queryFn: () => api.getInstructorProfile(user!.id),
    enabled: !!token && isInstructor && !!user?.id,
  })

  const baseProfile = data?.user ?? user
  const instructor = instructorData?.instructor

  const profile = baseProfile
    ? {
        ...baseProfile,
        headline: instructor?.headline ?? baseProfile.headline,
        bio: instructor?.bio ?? baseProfile.bio,
        avatar_url: instructor?.avatar_url ?? baseProfile.avatar_url,
        website_url: instructor?.website_url,
        linkedin_url: instructor?.linkedin_url,
        youtube_url: instructor?.youtube_url,
        github_url: instructor?.github_url,
      }
    : null

  const updateMutation = useMutation({
    mutationFn: async (fields: ProfileFormValues): Promise<{ user: User }> => {
      if (isInstructor) {
        return api.updateInstructorPublicProfile(token!, {
          name: fields.name,
          headline: fields.headline,
          bio: fields.bio,
          avatar_url: fields.avatar_url,
          website_url: fields.website_url,
          linkedin_url: fields.linkedin_url,
          youtube_url: fields.youtube_url,
          github_url: fields.github_url,
        })
      }
      return api.updateProfile(token!, {
        name: fields.name,
        headline: fields.headline,
        bio: fields.bio,
        avatar_url: fields.avatar_url,
      })
    },
    onSuccess: (res) => {
      setUser(res.user)
      setMessage('Profile updated successfully')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['instructor-profile-self'] })
      queryClient.invalidateQueries({ queryKey: ['instructor-profile-completeness'] })
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
        key={`${profile.id}-${instructor?.slug ?? ''}`}
        profile={profile}
        instructorSlug={instructor?.slug}
        saving={updateMutation.isPending}
        message={message}
        onSubmit={(fields) => updateMutation.mutate(fields)}
      />
    </div>
  )
}
