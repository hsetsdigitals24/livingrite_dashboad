import { defineField, defineType } from 'sanity'

export const testimonialSchema = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    // ─── Core identity ───────────────────────────────────────────────
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'clientName', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientRole',
      title: 'Client Role / Relationship',
      description: 'e.g. "Patient", "Family Caregiver", "Son of Patient"',
      type: 'string',
    }),
    defineField({
      name: 'clientLocation',
      title: 'Client Location',
      description: 'e.g. "Lagos, Nigeria"',
      type: 'string',
    }),

    // ─── Avatar / profile picture ────────────────────────────────────
    defineField({
      name: 'avatarUrl',
      title: 'Profile Picture (Google Drive URL)',
      description: 'Direct link to a profile image hosted on Google Drive. Use the shareable link format: https://drive.google.com/uc?export=view&id=FILE_ID',
      type: 'url',
    }),
    defineField({
      name: 'avatarImage',
      title: 'Profile Picture (Uploaded)',
      description: 'Alternative: upload the photo directly to Sanity.',
      type: 'image',
      options: { hotspot: true },
    }),

    // ─── The testimonial itself ───────────────────────────────────────
    defineField({
      name: 'quote',
      title: 'Testimonial Quote',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required().min(20).max(1200),
    }),
    defineField({
      name: 'shortQuote',
      title: 'Short Quote (for widget preview)',
      description: 'A condensed version shown in the homepage/about widget (max 180 chars).',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(180),
    }),

    // ─── Rating ──────────────────────────────────────────────────────
    defineField({
      name: 'rating',
      title: 'Star Rating',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      options: {
        list: [
          { title: '⭐ 1 star', value: 1 },
          { title: '⭐⭐ 2 stars', value: 2 },
          { title: '⭐⭐⭐ 3 stars', value: 3 },
          { title: '⭐⭐⭐⭐ 4 stars', value: 4 },
          { title: '⭐⭐⭐⭐⭐ 5 stars', value: 5 },
        ],
      },
    }),

    // ─── Media (Google Drive links) ───────────────────────────────────
    defineField({
      name: 'mediaItems',
      title: 'Media (Photos / Videos)',
      description: 'Attach photos or videos hosted on Google Drive.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'mediaItem',
          title: 'Media Item',
          fields: [
            defineField({
              name: 'mediaType',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Photo', value: 'photo' },
                  { title: 'Video', value: 'video' },
                ],
                layout: 'radio',
              },
              initialValue: 'photo',
            }),
            defineField({
              name: 'driveUrl',
              title: 'Google Drive URL',
              description: 'For photos: https://drive.google.com/uc?export=view&id=FILE_ID  |  For videos: https://drive.google.com/file/d/FILE_ID/preview',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption (optional)',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'caption', subtitle: 'mediaType' },
            prepare({ title, subtitle }) {
              return { title: title || 'Untitled', subtitle }
            },
          },
        },
      ],
    }),

    // ─── Service context ─────────────────────────────────────────────
    defineField({
      name: 'serviceReceived',
      title: 'Service Received',
      description: 'Which LivingRite service did this client use?',
      type: 'string',
      options: {
        list: [
          { title: 'Post-Stroke Recovery Care', value: 'post-stroke' },
          { title: 'ICU / Critical Care', value: 'icu' },
          { title: 'Physiotherapy', value: 'physiotherapy' },
          { title: 'Palliative Care', value: 'palliative' },
          { title: 'General Home Nursing', value: 'home-nursing' },
          { title: 'Wound Care', value: 'wound-care' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),

    // ─── Meta / SEO ───────────────────────────────────────────────────
    defineField({
      name: 'featuredOnHomepage',
      title: 'Feature on Homepage Widget',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOnAbout',
      title: 'Feature on About Us Page Widget',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isVerified',
      title: 'Verified Testimonial',
      description: "Mark as verified once you have confirmed the client's identity.",
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured / Pinned',
      description: 'Pin this testimonial to the top of the testimonials page.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description (optional)',
      description: 'Auto-generated from quote if left blank.',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
  ],

  preview: {
    select: {
      title: 'clientName',
      subtitle: 'serviceReceived',
      media: 'avatarImage',
    },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle || 'Testimonial', media }
    },
  },
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Featured first',
      name: 'featuredFirst',
      by: [{ field: 'featured', direction: 'desc' }, { field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
