import {defineField, defineType} from 'sanity'

export const commentType = defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'post',
      type: 'reference',
      to: [{type: 'post'}],
      validation: (rule) => rule.required(),
      description: 'The blog post this comment belongs to',
    }),
    defineField({
      name: 'author',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Name of the person commenting',
    }),
    defineField({
      name: 'email',
      type: 'string',
      validation: (rule) => rule.required().email(),
      description: 'Email address for notifications',
    }),
    defineField({
      name: 'content',
      type: 'text',
      validation: (rule) => rule.required().min(10).max(5000),
      description: 'The comment text',
    }),
    defineField({
      name: 'likes',
      type: 'number',
      initialValue: 0,
      description: 'Number of likes this comment has',
    }),
     defineField({
      name: 'flagged',
      type: 'boolean',
      initialValue: false,
      description: 'Whether this comment has been flagged for review',
    }),
    defineField({
      name: 'isApproved',
      type: 'boolean',
      initialValue: false,
      description: 'Whether this comment has been approved by admin',
    }),
    defineField({
      name: 'isVerified',
      type: 'boolean',
      initialValue: false,
      description: 'Whether this is a verified/credible commenter',
    }),
    defineField({
      name: 'timestamp',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
      description: 'When the comment was created',
    }),
  ],
})