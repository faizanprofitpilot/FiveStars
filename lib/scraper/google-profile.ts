import { chromium, type Browser } from 'playwright'

interface GoogleBusinessProfile {
  name: string | null
  category: string | null
  description: string | null
  services: string[]
}

export async function scrapeGoogleProfile(url: string): Promise<{
  success: boolean
  data?: GoogleBusinessProfile
  contextDocument?: string
  error?: string
}> {
  let browser: Browser | null = null

  try {
    // Validate URL
    if (!url || !url.includes('google.com')) {
      return {
        success: false,
        error: 'Invalid Google Business Profile URL',
      }
    }

    // Launch browser
    browser = await chromium.launch({
      headless: true,
    })

    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Extract business information
    const businessData: GoogleBusinessProfile = {
      name: null,
      category: null,
      description: null,
      services: [],
    }

    // Extract business name
    try {
      businessData.name = await page
        .locator('h1[data-attrid="title"]')
        .or(page.locator('h1'))
        .first()
        .textContent()
        .then((text) => text?.trim() || null)
    } catch (e) {
      console.error('Error extracting name:', e)
    }

    // Extract category
    try {
      businessData.category = await page
        .locator('[data-attrid="kc:/location/location:category"]')
        .or(page.locator('button[data-value="category"]'))
        .first()
        .textContent()
        .then((text) => text?.trim() || null)
    } catch (e) {
      // Try alternative selectors
      try {
        const categoryElement = await page.locator('button:has-text("·")').first()
        businessData.category = await categoryElement.textContent().then((text) => text?.split('·')[0]?.trim() || null)
      } catch (e2) {
        console.error('Error extracting category:', e2)
      }
    }

    // Extract description/about section
    try {
      businessData.description = await page
        .locator('[data-section-id="overview"]')
        .or(page.locator('div:has-text("About")').locator('..'))
        .first()
        .textContent()
        .then((text) => text?.trim() || null)
    } catch (e) {
      console.error('Error extracting description:', e)
    }

    // Extract services (if available)
    try {
      const serviceElements = await page.locator('[data-attrid="kc:/location/location:services"] button, [data-section-id="amenities"] button').all()
      if (serviceElements.length === 0) {
        // Try alternative selector
        const altServices = await page.locator('div:has-text("Services")').locator('..').locator('span').all()
        for (const element of altServices.slice(0, 10)) {
          const text = await element.textContent()
          if (text && text.trim()) {
            businessData.services.push(text.trim())
          }
        }
      } else {
        for (const element of serviceElements.slice(0, 10)) {
          const text = await element.textContent()
          if (text && text.trim()) {
            businessData.services.push(text.trim())
          }
        }
      }
    } catch (e) {
      console.error('Error extracting services:', e)
    }

    await browser.close()
    browser = null

    // Generate context document
    const contextDocument = generateContextDocument(businessData)

    return {
      success: true,
      data: businessData,
      contextDocument,
    }
  } catch (error: any) {
    if (browser) {
      await browser.close()
    }
    return {
      success: false,
      error: error.message || 'Failed to scrape Google Business Profile',
    }
  }
}

function generateContextDocument(data: GoogleBusinessProfile): string {
  const paragraphs: string[] = []

  if (data.name) {
    paragraphs.push(`${data.name} is a business`)
    if (data.category) {
      paragraphs[0] += ` in the ${data.category} category`
    }
    paragraphs[0] += '.'
  }

  if (data.description) {
    paragraphs.push(data.description)
  }

  if (data.services.length > 0) {
    paragraphs.push(
      `They offer the following services: ${data.services.join(', ')}.`
    )
  }

  // If we couldn't extract much, provide a generic context
  if (paragraphs.length === 0) {
    paragraphs.push(
      'This is a local business that values customer satisfaction and aims to provide excellent service.'
    )
  }

  return paragraphs.join('\n\n')
}

