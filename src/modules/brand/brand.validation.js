import joi from 'joi';
import { generalFields } from '../../middleware/vaildation.js';

export const addBrandVal = joi.object({
    name: generalFields.name.required(),
})