/**
 * Vendor Registry
 * Maps canonical vendor names to their metadata.
 * Icons are lazy-checked — if an Si icon doesn't exist the component uses the letter fallback.
 *
 * category values match backend Category enum:
 *   DEV | DESIGN | SALES | MARKETING | HR | FINANCE | PRODUCTIVITY | OTHER
 */

// ─── Icon imports (only those confirmed to exist in installed react-icons) ────
import {
  SiAnthropic, SiGoogle, SiGithub, SiGitlab, SiGooglecloud,
  SiDatadog, SiZoom, SiNotion, SiFigma, SiHubspot,
  SiJira, SiTrello, SiAsana, SiDropbox, SiZendesk,
  SiShopify, SiStripe, SiMailchimp, SiSnowflake, SiMongodb,
  SiDocker, SiPostman, SiVercel, SiCloudflare, SiGrafana,
  SiLinear, SiMiro, SiAtlassian,
} from 'react-icons/si';

/**
 * Each entry:
 * {
 *   label:      string   — display name shown in UI
 *   icon:       Component | null   — react-icons Si component, or null for letter fallback
 *   brandColor: string   — hex, used for tile background tint & first-letter avatar
 *   category:   string   — maps to backend Category enum
 *   website:    string
 * }
 */
const VENDOR_REGISTRY = {
  // ── AI / LLM ──────────────────────────────────────────────────────────────
  openai: {
    label: 'OpenAI',
    icon: null,           // SiOpenai not in this version
    brandColor: '#10A37F',
    category: 'DEV',
    website: 'openai.com',
  },
  chatgpt: {
    label: 'ChatGPT',
    icon: null,
    brandColor: '#10A37F',
    category: 'PRODUCTIVITY',
    website: 'chat.openai.com',
  },
  anthropic: {
    label: 'Anthropic',
    icon: SiAnthropic,
    brandColor: '#D4A36B',
    category: 'DEV',
    website: 'anthropic.com',
  },
  claude: {
    label: 'Claude',
    icon: SiAnthropic,
    brandColor: '#D4A36B',
    category: 'PRODUCTIVITY',
    website: 'claude.ai',
  },
  gemini: {
    label: 'Gemini',
    icon: SiGoogle,
    brandColor: '#4285F4',
    category: 'PRODUCTIVITY',
    website: 'gemini.google.com',
  },

  // ── Microsoft ──────────────────────────────────────────────────────────────
  'microsoft 365': {
    label: 'Microsoft 365',
    icon: null,
    brandColor: '#D83B01',
    category: 'PRODUCTIVITY',
    website: 'microsoft.com',
  },
  'office 365': {
    label: 'Microsoft 365',
    icon: null,
    brandColor: '#D83B01',
    category: 'PRODUCTIVITY',
    website: 'microsoft.com',
  },
  microsoft: {
    label: 'Microsoft',
    icon: null,
    brandColor: '#00A4EF',
    category: 'PRODUCTIVITY',
    website: 'microsoft.com',
  },
  'azure': {
    label: 'Azure',
    icon: null,
    brandColor: '#0078D4',
    category: 'DEV',
    website: 'azure.microsoft.com',
  },
  'microsoft azure': {
    label: 'Azure',
    icon: null,
    brandColor: '#0078D4',
    category: 'DEV',
    website: 'azure.microsoft.com',
  },

  // ── Code & DevOps ──────────────────────────────────────────────────────────
  github: {
    label: 'GitHub',
    icon: SiGithub,
    brandColor: '#238636',
    category: 'DEV',
    website: 'github.com',
  },
  'github enterprise': {
    label: 'GitHub Enterprise',
    icon: SiGithub,
    brandColor: '#238636',
    category: 'DEV',
    website: 'github.com',
  },
  gitlab: {
    label: 'GitLab',
    icon: SiGitlab,
    brandColor: '#FC6D26',
    category: 'DEV',
    website: 'gitlab.com',
  },
  aws: {
    label: 'AWS',
    icon: null,
    brandColor: '#FF9900',
    category: 'DEV',
    website: 'aws.amazon.com',
  },
  'aws cloud services': {
    label: 'AWS Cloud',
    icon: null,
    brandColor: '#FF9900',
    category: 'DEV',
    website: 'aws.amazon.com',
  },
  amazon: {
    label: 'Amazon AWS',
    icon: null,
    brandColor: '#FF9900',
    category: 'DEV',
    website: 'aws.amazon.com',
  },
  'google cloud': {
    label: 'Google Cloud',
    icon: SiGooglecloud,
    brandColor: '#4285F4',
    category: 'DEV',
    website: 'cloud.google.com',
  },
  gcp: {
    label: 'Google Cloud',
    icon: SiGooglecloud,
    brandColor: '#4285F4',
    category: 'DEV',
    website: 'cloud.google.com',
  },
  datadog: {
    label: 'Datadog',
    icon: SiDatadog,
    brandColor: '#632CA6',
    category: 'DEV',
    website: 'datadoghq.com',
  },
  'datadog monitoring': {
    label: 'Datadog',
    icon: SiDatadog,
    brandColor: '#632CA6',
    category: 'DEV',
    website: 'datadoghq.com',
  },
  docker: {
    label: 'Docker',
    icon: SiDocker,
    brandColor: '#2496ED',
    category: 'DEV',
    website: 'docker.com',
  },
  postman: {
    label: 'Postman',
    icon: SiPostman,
    brandColor: '#FF6C37',
    category: 'DEV',
    website: 'postman.com',
  },
  vercel: {
    label: 'Vercel',
    icon: SiVercel,
    brandColor: '#000000',
    category: 'DEV',
    website: 'vercel.com',
  },
  cloudflare: {
    label: 'Cloudflare',
    icon: SiCloudflare,
    brandColor: '#F38020',
    category: 'DEV',
    website: 'cloudflare.com',
  },
  grafana: {
    label: 'Grafana',
    icon: SiGrafana,
    brandColor: '#F46800',
    category: 'DEV',
    website: 'grafana.com',
  },
  mongodb: {
    label: 'MongoDB',
    icon: SiMongodb,
    brandColor: '#00ED64',
    category: 'DEV',
    website: 'mongodb.com',
  },
  snowflake: {
    label: 'Snowflake',
    icon: SiSnowflake,
    brandColor: '#29B5E8',
    category: 'DEV',
    website: 'snowflake.com',
  },
  linear: {
    label: 'Linear',
    icon: SiLinear,
    brandColor: '#5E6AD2',
    category: 'DEV',
    website: 'linear.app',
  },

  // ── Communication & Productivity ───────────────────────────────────────────
  slack: {
    label: 'Slack',
    icon: null,
    brandColor: '#4A154B',
    category: 'PRODUCTIVITY',
    website: 'slack.com',
  },
  zoom: {
    label: 'Zoom',
    icon: SiZoom,
    brandColor: '#2D8CFF',
    category: 'PRODUCTIVITY',
    website: 'zoom.us',
  },
  'zoom enterprise': {
    label: 'Zoom Enterprise',
    icon: SiZoom,
    brandColor: '#2D8CFF',
    category: 'PRODUCTIVITY',
    website: 'zoom.us',
  },
  notion: {
    label: 'Notion',
    icon: SiNotion,
    brandColor: '#000000',
    category: 'PRODUCTIVITY',
    website: 'notion.so',
  },
  miro: {
    label: 'Miro',
    icon: SiMiro,
    brandColor: '#FFD02F',
    category: 'PRODUCTIVITY',
    website: 'miro.com',
  },
  dropbox: {
    label: 'Dropbox',
    icon: SiDropbox,
    brandColor: '#0061FF',
    category: 'PRODUCTIVITY',
    website: 'dropbox.com',
  },
  asana: {
    label: 'Asana',
    icon: SiAsana,
    brandColor: '#F06A6A',
    category: 'PRODUCTIVITY',
    website: 'asana.com',
  },
  trello: {
    label: 'Trello',
    icon: SiTrello,
    brandColor: '#0052CC',
    category: 'PRODUCTIVITY',
    website: 'trello.com',
  },

  // ── Design ─────────────────────────────────────────────────────────────────
  figma: {
    label: 'Figma',
    icon: SiFigma,
    brandColor: '#F24E1E',
    category: 'DESIGN',
    website: 'figma.com',
  },
  'figma enterprise': {
    label: 'Figma Enterprise',
    icon: SiFigma,
    brandColor: '#F24E1E',
    category: 'DESIGN',
    website: 'figma.com',
  },
  adobe: {
    label: 'Adobe',
    icon: null,
    brandColor: '#FF0000',
    category: 'DESIGN',
    website: 'adobe.com',
  },
  canva: {
    label: 'Canva',
    icon: null,
    brandColor: '#00C4CC',
    category: 'DESIGN',
    website: 'canva.com',
  },

  // ── Sales & CRM ────────────────────────────────────────────────────────────
  salesforce: {
    label: 'Salesforce',
    icon: null,
    brandColor: '#00A1E0',
    category: 'SALES',
    website: 'salesforce.com',
  },
  'salesforce enterprise crm': {
    label: 'Salesforce CRM',
    icon: null,
    brandColor: '#00A1E0',
    category: 'SALES',
    website: 'salesforce.com',
  },
  hubspot: {
    label: 'HubSpot',
    icon: SiHubspot,
    brandColor: '#FF7A59',
    category: 'SALES',
    website: 'hubspot.com',
  },
  'hubspot marketing hub': {
    label: 'HubSpot Marketing',
    icon: SiHubspot,
    brandColor: '#FF7A59',
    category: 'MARKETING',
    website: 'hubspot.com',
  },
  zendesk: {
    label: 'Zendesk',
    icon: SiZendesk,
    brandColor: '#03363D',
    category: 'SALES',
    website: 'zendesk.com',
  },

  // ── Marketing ──────────────────────────────────────────────────────────────
  mailchimp: {
    label: 'Mailchimp',
    icon: SiMailchimp,
    brandColor: '#FFE01B',
    category: 'MARKETING',
    website: 'mailchimp.com',
  },

  // ── eCommerce & Payments ───────────────────────────────────────────────────
  shopify: {
    label: 'Shopify',
    icon: SiShopify,
    brandColor: '#96BF48',
    category: 'SALES',
    website: 'shopify.com',
  },
  stripe: {
    label: 'Stripe',
    icon: SiStripe,
    brandColor: '#635BFF',
    category: 'FINANCE',
    website: 'stripe.com',
  },

  // ── Project Management ─────────────────────────────────────────────────────
  jira: {
    label: 'Jira',
    icon: SiJira,
    brandColor: '#0052CC',
    category: 'DEV',
    website: 'atlassian.com/jira',
  },
  atlassian: {
    label: 'Atlassian',
    icon: SiAtlassian,
    brandColor: '#0052CC',
    category: 'DEV',
    website: 'atlassian.com',
  },

  // ── Google Suite ───────────────────────────────────────────────────────────
  google: {
    label: 'Google Workspace',
    icon: SiGoogle,
    brandColor: '#4285F4',
    category: 'PRODUCTIVITY',
    website: 'workspace.google.com',
  },
  'google workspace': {
    label: 'Google Workspace',
    icon: SiGoogle,
    brandColor: '#4285F4',
    category: 'PRODUCTIVITY',
    website: 'workspace.google.com',
  },
};

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Look up a vendor by name (case-insensitive).
 * Returns the registry entry or null if not found.
 */
export function lookupVendor(name) {
  if (!name) return null;
  return VENDOR_REGISTRY[name.toLowerCase().trim()] || null;
}

/**
 * Get all known vendor entries for autocomplete.
 * Returns an array of { key, ...entry } sorted by label.
 */
export function getAllVendors() {
  const seen = new Set();
  const result = [];
  for (const [key, entry] of Object.entries(VENDOR_REGISTRY)) {
    if (!seen.has(entry.label)) {
      seen.add(entry.label);
      result.push({ key, ...entry });
    }
  }
  return result.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Search vendors by query string (name match).
 */
export function searchVendors(query) {
  if (!query) return getAllVendors().slice(0, 8);
  const q = query.toLowerCase().trim();
  return getAllVendors().filter(v =>
    v.label.toLowerCase().includes(q) || v.key.includes(q)
  ).slice(0, 8);
}

export default VENDOR_REGISTRY;
