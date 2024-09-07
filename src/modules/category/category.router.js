import {Router} from 'express';
import { fileUpload } from '../../utils/multer.js';
import { isValid } from '../../middleware/vaildation.js';
import { addCategoryVal, updateCategoryVal } from './category.validation.js';
import { asyncHandler } from '../../utils/appError.js';
import { addCategory , updateCategory,getCategories } from './category.controller.js';
const categoryRouter = Router()

// add category todo authentication & auth
categoryRouter.post('/',
  fileUpload({folder:'category'}).single('image'),
  isValid(addCategoryVal),
  asyncHandler(addCategory)

)
// update category todo authentication autherazation 
categoryRouter.put('/:categoryId',
  fileUpload({folder:'category'}).single('image'),
  isValid(updateCategoryVal),
  asyncHandler(updateCategory)
)

// get all categories
categoryRouter.get('/',asyncHandler(getCategories))

export default categoryRouter;