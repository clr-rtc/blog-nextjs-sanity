import {
  getAllPages,
  getAllPagesSlugs,
  getAllPosts,
  getClient,
} from 'lib/sanity.client'

type SitemapLocation = {
  url: string
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority: number
  lastmod?: Date
}

const createSitemap = (locations: SitemapLocation[]) => {
  const baseUrl = process.env.NEXT_PUBLIC_URL // Make sure to configure this

  if (!baseUrl) {
    console.error('*** Sitemap: NEXT_PUBLIC_URL not set')
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${locations
        .map((location) => {
          return `<url>
                    <loc>${baseUrl}${location.url}</loc>
                    <priority>${location.priority}</priority>
                    ${
                      location.lastmod
                        ? `<lastmod>${location.lastmod.toISOString()}</lastmod>`
                        : ''
                    }
                  </url>`
        })
        .join('')}
  </urlset>
  `
}

export default function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  const client = getClient()

  // Get list of Post urls
  const [posts = []] = await Promise.all([getAllPosts(client)])
  const postUrls: SitemapLocation[] = posts
    .filter(({ slug = '' }) => slug)
    .map((post) => {
      return {
        url: `/posts/${post.slug}`,
        priority: 0.5,
        lastmod: new Date(post._updatedAt),
      }
    })

  // ... get more routes here
  const englishPosts = postUrls.map((postUrl) => {
    return { ...postUrl, url: '/en' + postUrl.url }
  })

  // Get the pages
  const [pages = []] = await Promise.all([getAllPages(client)])
  const pageUrls: SitemapLocation[] = pages
    .filter(({ slug = '' }) => slug)
    .map((post) => {
      return {
        url: post.slug[0] === '/' ? post.slug : `/pages/${post.slug}`,
        priority: 0.5,
        lastmod: new Date(post._updatedAt),
      }
    })

  const englishPages = pageUrls.map((pageUrl) => {
    return { ...pageUrl, url: '/en' + pageUrl.url }
  })

  // Return the default urls, combined with dynamic urls above
  const locations = [...postUrls, ...englishPosts, ...pageUrls, ...englishPages]

  // Set response to XML
  res.setHeader('Content-Type', 'text/xml')
  res.write(createSitemap(locations))
  res.end()

  return {
    props: {},
  }
}
