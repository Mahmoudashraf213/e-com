import slugify from "slugify";
import { Brand, Product, Subcategory } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import cloudinary from "../../utils/cloud.js";

// add product
export const addProduct = async (req, res, next) => {
  // get data from req
  const {
    name,
    description,
    stock,
    price,
    discount,
    discountType,
    colors,
    sizes,
    category,
    subcategory,
    brand,
  } = req.body;
  // check existence
  // 1- brand exist
  const brandExists = await Brand.findById(brand);
  if (!brandExists) {
    return next(new AppError(messages.brand.notFound, 404));
  }
  // 2- subcategory exist
  const subcategoryExist = await Subcategory.findById(subcategory);
  if (!subcategoryExist) {
    return next(new AppError(messages.subcategory.notFound, 404));
  }
  // upload images
  // req.files >>> {mainImage:[{}],subImages:[{},{},{},{}]}
  
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path,{ folder: "hti-g1/products/main-images" });
  let mainImage = { secure_url, public_id }
  let subImages = [];
  // req.files.subImages.forEach(async (file) => {
  //   const {secure_url,public_id} = await cloudinary.uploader.upload(file.path,{folder:"hti-g1/products/sub-images"})
  //   subImages.push({secure_url,public_id});
  // })
  for(const file of req.files.subImages) {
    const {secure_url,public_id} = await cloudinary.uploader.upload(file.path,{folder:"hti-g1/products/sub-images"})
    subImages.push({secure_url,public_id});
  }
  // perpara data
  const slug = slugify(name);
  const product = new Product({
    name,
    slug,
    description,
    stock,
    price,
    discount,
    discountType,
    colors:JSON.parse(colors),
    sizes:JSON.parse(sizes),
    category,
    subcategory,
    brand,
    mainImage,
    subImages
    // todo createBy updatedBy token
  })
  // add to db
  const createdProduct = await product.save()
  if (!createdProduct) {
    // todo rollback 
    return next(new AppError(messages.product.failToCreate,500))
  }
  // send response
  return res.status(201).json({
    message: messages.product.createSuccessfully,
    success: true,
    data: createdProduct
  })

};
