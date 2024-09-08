import slugify from "slugify";
import { Brand } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import  cloudinary  from "../../utils/cloud.js";

export const addBrand = async (req, res, next) => {
  // get data from db
  let { name } = req.body;
  name = name.toLowerCase();
  // check existence
  const brandExists = await Brand.findOne({ name });
  if (brandExists) {
    return next(new AppError(messages.brand.alreadyExist, 409));
  }
  // prepare obj
  // upload image
  const { secur_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "hti-g1/brand",
    }
  );
  const slug = slugify(name);
  const brand = new Brand({ name,
    slug,
    logo: { secur_url, public_id } 
    //  createBy : todo token
  });
  // add to db
  const createBrand = await brand.save()
  if (!createBrand) {
     // rollback
      req.failImage = { secur_url, public_id }
    return next(new AppError(messages.brand.failToCreate,500))
  }
  // send response
  return res.status(201).json({
    message : messages.brand.createSuccessfully,
    success : true,
    data : createBrand
  })
};
