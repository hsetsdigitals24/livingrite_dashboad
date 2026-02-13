import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      description: 'Brief summary of the article',
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Post-Acute Care', value: 'post-acute' },
          { title: 'Stroke Recovery', value: 'stroke' },
          { title: 'ICU Recovery', value: 'icu' },
          { title: 'Palliative Care', value: 'palliative' },
          { title: 'Family Caregiving', value: 'family' },
          { title: 'Wellness Tips', value: 'wellness' },
        ],
      },
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      description: 'Main article image',
    }),
    defineField({
      name: 'author',
      type: 'object',
      fields: [
        {
          name: 'name',
          type: 'string',
          validation: (rule) => rule.required(),
        },
        {
          name: 'image',
          type: 'image',
        },
      ],
    }),
    defineField({
      name: 'readingTime',
      type: 'number',
      description: 'Estimated reading time in minutes',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'comments',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'comment'}],
        },
      ],
      description: 'Comments on this post',
    }),
  ],
})