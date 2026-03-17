import { type SchemaTypeDefinition } from 'sanity'
import {postType} from './post' 
import {commentType} from './comments'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, commentType],
}
