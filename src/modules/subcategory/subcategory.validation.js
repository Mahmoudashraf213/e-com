import joi from 'joi'
import { generalFields } from '../../middleware/vaildation.js'


export const addSubcategoryVal = joi.object({
  name:generalFields.name.required(),
  category:generalFields.objectId.required(),
})