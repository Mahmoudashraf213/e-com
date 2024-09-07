import { Router } from "express";
import { fileUpload } from "../../utils/multer.js";
import { isValid } from "../../middleware/vaildation.js";
import { addSubcategoryVal } from "./subcategory.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { addSubcategory ,getSubcategory} from "./subcategory.contoller.js";
const subcategoryRouter = Router();

// add subcategory todo authentication auth
subcategoryRouter.post("/",
  fileUpload({ folder: "subcategory" }).single('image'),
  isValid(addSubcategoryVal),
  asyncHandler(addSubcategory)
)

// get subcategory 
subcategoryRouter.get('/:categoryId',asyncHandler(getSubcategory))

export default subcategoryRouter;
