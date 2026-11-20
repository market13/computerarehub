/**
 * Centralized Store Information & Catalog Constants
 */
const metaEnv = (typeof import.meta !== 'undefined' && import.meta?.env) ? import.meta.env : {};
const procEnv = (typeof process !== 'undefined' && process?.env) ? process.env : {};

export const STORE_NAME = 'Computer Care';
export const STORE_PHONE = '+919810550222';
export const STORE_DISPLAY_PHONE = '+91 9810550222';
export const STORE_CITY = 'Ghaziabad';
export const STORE_STATE = 'Uttar Pradesh';
export const STORE_COUNTRY = 'India';
export const STORE_ADDRESS = 'G 23 Shiva Tower, Ghaziabad, Uttar Pradesh 201009';
export const STORE_HOURS = 'Mon-Sat 10:30 AM - 8:00 PM IST (Closed Sunday)';
export const STORE_DOMAIN = 'https://computercaregzb.com';
export const SITE_URL = metaEnv.VITE_SITE_URL || procEnv.VITE_SITE_URL || STORE_DOMAIN;

// TODO: Replace with verified social media and Google Business Profile links
export const GOOGLE_MAPS_URL = metaEnv.VITE_GOOGLE_MAPS_URL || procEnv.VITE_GOOGLE_MAPS_URL || 'https://maps.google.com/?q=G+23+Shiva+Tower+Ghaziabad+Uttar+Pradesh+201009'; // TODO: confirm exact Google Maps link
export const INSTAGRAM_URL = metaEnv.VITE_INSTAGRAM_URL || procEnv.VITE_INSTAGRAM_URL || ''; // TODO: confirm store Instagram profile URL
export const STORE_LANDMARK = 'Shiva Tower Commercial Complex, Central Ghaziabad'; // TODO: confirm exact nearby landmark (e.g. Near Old Bus Stand / Railway Station)

// Verified store contact email for notifications and customer inquiries
export const CONTACT_EMAIL = metaEnv.VITE_CONTACT_EMAIL || procEnv.VITE_CONTACT_EMAIL || 'support@computercaregzb.com';

// Reconciled single constant for product count claims across UI, SEO, and marketing
export const TOTAL_PRODUCTS_COUNT = '3,200+';
export const TOTAL_PRODUCTS_SEARCH_PLACEHOLDER = 'Search 3,200+ PC components, rigs...';

