import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      changeFrequency: 'yearly',
      priority: 1
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/register`,
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/forgot-password`,
      changeFrequency: 'monthly',
      priority: 0.8
    }
  ]
}
