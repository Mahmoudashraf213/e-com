import { Router } from "express";
import { cloudUploads } from "../../utils/multer-cloud.js";
import { isValid } from "../../middleware/vaildation.js";
import { addBrandVal, updateBrandVal } from "./brand.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { addBrand, updateBrand } from "./brand.controller.js";
import { isAuthorized } from "../../middleware/autheraization.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { roles } from "../../utils/constant/enums.js";

const brandRouter = Router()
// add brand todo authentication authorization
brandRouter.post('/',
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  cloudUploads().single('logo'),
  isValid(addBrandVal),
  asyncHandler(addBrand)
)

// update brand todo authentication authorization
brandRouter.put('/:brandId',
  cloudUploads({}).single('logo'),
  isValid(updateBrandVal),
  asyncHandler(updateBrand)
)

export default brandRouter