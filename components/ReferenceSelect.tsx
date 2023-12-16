//ReferenceSelect.js

import React, { useEffect, useState, forwardRef, ForwardedRef } from 'react'
import { Card, Flex, Grid, Checkbox, Box, Text, Stack } from '@sanity/ui'
import { getClient } from 'lib/sanity.client'
import {StringInputProps, set, unset} from 'sanity'

function stripDiacritics(text: string){
    return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
}

const ReferenceSelect = (props) => {
  
  const [keywords, setKeywords] = useState([])

  const client = getClient()
  
   

  useEffect(() => {
    const compareKeywords = ((a, b) => {
        const t1 = stripDiacritics(a.title as string)
        const t2 = stripDiacritics(b.title as string)
        return t1 < t2? -1 : t1 === t2? 0 : 1
    }) 
    const fetchKeywords = async () => {
        const result: any[] = await client
            .fetch(`*[_type == 'keyword']{
            _id,
            title,
            title_en
            }`)

        result.sort(compareKeywords)
    
        setKeywords(result)
    }

    fetchKeywords()
  }, [client]) 

  const {
    elementProps: {
      id,
      onBlur,  
      onFocus,
      placeholder,
      readOnly,
      ref,
      // value
    },
    onChange,
    schemaType,
    validation,
    value = ''
  } = props

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
        const target = e.currentTarget
        const eventValue = target.value
        
        const inputValue = {
            _key: eventValue.slice(0, 10),
            _type: 'reference',
            _ref: eventValue
        }
      
      if(value) {
        if(value.some(item => item._ref === inputValue._ref)) {
          onChange(set(value.filter(item => item._ref != inputValue._ref)))
        } else {
          onChange(set([...value, inputValue]))
        }
      } else {
        onChange(set([inputValue]))
      }
    },
    [value, onChange]
  )

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.currentTarget
        const eventValue = target.value
        
        const inputValue = {
            _key: eventValue.slice(0, 10),
            _type: 'reference',
            _ref: eventValue
        }
      
      if(value) {
        if(value.some(item => item._ref === inputValue._ref)) {
          onChange(set(value.filter(item => item._ref != inputValue._ref)))
        } else {
          onChange(set([...value, inputValue]))
        }
      } else {
        onChange(set([inputValue]))
      }
    },
    [value, onChange]
  )

  

	return (
    <Card border padding={3}>
        <Grid autoFlow='row' columns={3}>
         
      {
        keywords.map(kw => (
          <Card key={kw._id} padding={2}>
            <Flex align="center">
              <Checkbox 
                id="checkbox" 
                style={{display: 'block'}} 
               
                onChange={handleChange}
                value={kw._id}
                checked={value ? value.some(item => item._ref === kw._id) : false}
              />
              <Box flex={1} paddingLeft={3}>
                <Text>
                  <label htmlFor="checkbox">{kw.title}</label>
                </Text>
              </Box>
            </Flex>
          </Card>
        ))
      }
      </Grid>
    </Card>
	)
}

export default ReferenceSelect