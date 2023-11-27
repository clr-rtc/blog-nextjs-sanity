import { defineType } from 'sanity'

export default defineType({ 
  name: 'blockContent', 
  type: 'array', 
  of: [ 
    { type: 'block', 
      of: [ 
        {name: 'authorReference', 
        type: 'reference', 
        to: [{type: 'author'}]
        } 
      ] 
    } 
  ] 
})