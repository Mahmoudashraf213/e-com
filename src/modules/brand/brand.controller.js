import slugify from "slugify";
import { Brand } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import cloudinary from "../../utils/cloud.js";

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
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "hti-g1/brand",
    }
  );
  const slug = slugify(name);
  const brand = new Brand({
    name,
    slug,
    logo: { secure_url, public_id },
    //  createBy : todo token
  });
  // add to db
  const createBrand = await brand.save();
  if (!createBrand) {
    // rollback
    req.failImage = { secure_url, public_id };
    return next(new AppError(messages.brand.failToCreate, 500));
  }
  // send response
  return res.status(201).json({
    message: messages.brand.createSuccessfully,
    success: true,
    data: createBrand,
  });
};

export const updateBrand = async (req, res, next) => {
  // get data from req
  let { name } = req.body;
  const { brandId } = req.params;
  name = name.toLowerCase();
  // check existence
  const barndExist = await Brand.findById(brandId);
  if (!barndExist) {
    return next(new AppError(messages.brand.notFound, 404));
  }
  // check name existence
  const nameExist = await Brand.findOne({ name, _id: { $ne: brandId } });
  if (nameExist) {
    return next(new AppError(messages.brand.alreadyExist, 409));
  }
  // prepare data
  if (name) {
    const slug = slugify(name);
    barndExist.name = name
    barndExist.slug = slug
  }
  // upload image
  if (req.file) {
    // delete old data
    // await cloudinary.uploader.destroy(barndExist.logo.public_id);
    // upload new image
    let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{
      public_id:barndExist.logo.public_id 
    })
    barndExist.logo={ secure_url, public_id } 
    req.failImage={ secure_url, public_id } 

  }
  // update to db
  const updatedBrand = await barndExist.save()
  if (!updatedBrand) {
    return next (new AppError(messages.brand.failToUpdate))
  }
  // send response
  return res.status(200).json({
    message: messages.brand.updateSuccessfully,
    success:true,
    date: updatedBrand
  })
};
