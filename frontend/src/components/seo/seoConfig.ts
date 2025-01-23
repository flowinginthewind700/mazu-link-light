// lib/seoConfig.ts
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

let cachedSEOConfig: any = null

export const loadSEOConfig = () => {
  if (cachedSEOConfig) {
    return cachedSEOConfig
  }

  const filePath = path.join(process.cwd(), 'config', 'seo.yaml')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  cachedSEOConfig = yaml.load(fileContents)
  return cachedSEOConfig
}