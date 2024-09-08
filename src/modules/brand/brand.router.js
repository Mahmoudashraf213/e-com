import { Router } from "express";
import { cloudUploads } from "../../utils/multer-cloud.js";
import { isValid } from "../../middleware/vaildation.js";
import { addBrandVal } from "./brand.validation.js";
import { asyncHandler } from "../../utils/appError.js";

const brandRouter = Router()
// add brand todo authentication authorization
brandRouter.post('/',
  cloudUploads().single('logo'),
  isValid(addBrandVal),
  asyncHandler()
)

export default brandRouter