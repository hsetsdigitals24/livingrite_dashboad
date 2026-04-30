import {defineField, defineType} from 'sanity'

export const testimonialType = defineType({
  name: 'testimonials',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'fullName'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      description: 'City and Country',
      type: 'string', 
      validation: (rule) => rule.required(),
    }),
      defineField({
      name: 'patientRelation',
      description: 'Relation to Patient',
      type: 'string', 
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'testimonial',
      type: 'text',
      validation: (rule) => rule.required()
    }),
  ],
})