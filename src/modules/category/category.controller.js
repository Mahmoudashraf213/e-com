import slugify from "slugify";
import { Category } from "../../../db/models/category.model.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { deleteFile } from "../../utils/file-functions.js";

// add category
export const addCategory = async (req, res, next) => {
  // get data from req
  let { name } = req.body;
  name = name.toLowerCase();
  // create file
  if (!req.file) {
    return next(new AppError(messages.file.required, 400));
  }
  // check existence
  const categoryExist = await Category.findOne(); // {},null
  if (categoryExist) {
    return next(new AppError(messages.category.alreadyExist, 409));
  }
  // prepare data
  const slug = slugify(name);
  const category = new Category({
    name,
    slug,
    image: { path: req.file.path },
  });
  // add to db
  const createdCategory = await category.save();
  if (!createdCategory) {
    // todo rollback delete image
    return next(new AppError(messages.category.failToCreate, 500));
  }
  // send response
  return res.status(201).json({
    messages: messages.category.createCategory,
    success: true,
    date: createdCategory,
  });
};

// update category
export const updateCategory = async (req, res, next) => {
  // get data from db
  const { name } = req.body;
  const { categoryId } = req.params;
  // check existence
  const categoryExist = await Category.findById(categoryId); //{} , null
  if (!categoryExist) {
    return next(new AppError(messages.category.notFound, 404));
  }
  //check name existence
  const nameExist = await Category.findOne({ name, _id: { $ne: categoryId } });
  if (nameExist) {
    return next(new AppError(messages.category.alreadyExist, 409));
  }
  // prepare data
  if (name) {
    categoryExist.slug = slugify(name);
  }
  // update image
  if (req.file) {
    deleteFile(categoryExist.image.path);
    categoryExist.image.path = req.file.path;
  }
  // update to db
  const updatedCategory = await categoryExist.save();
  if (!updatedCategory) {
    return next(new AppError(messages.category.failToUpdate, 500));
  }
  // send response
  return res.status(200).json({
    message: messages.category.updateSuccessfully,
    success: true,
    date: updatedCategory,
  });
};

// getCategories
export const getCategories = async (req, res, next) => {
  // const categories = await Category.find().populate([{path : "subcategories"}])
  const categories = await Category.aggregate([
    {
      $lookup:{
        from:'subcategories',
        localField:'_id',
        foreignField:'category',
        as:'subcategories'
      }
    }
  ])
  return res.status(200).json({ success: true, date: categories });
};
