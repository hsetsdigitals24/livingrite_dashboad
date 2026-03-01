import { type SchemaTypeDefinition } from 'sanity'
import {postType} from './post'
import {testimonialType} from './testimonials'
import {commentType} from './comments'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, testimonialType, commentType],
}
