// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { client } from './client'

// Placeholder for live queries - use regular client.fetch for now
export const sanityFetch = client.fetch.bind(client);
export const SanityLive = null;
