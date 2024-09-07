// import modules
import joi from "joi";
import { AppError } from "../utils/appError.js";

export const generalFields = {
  name: joi.string(),
  objectId: joi.string().hex().length(24),
};

// Define a schema using generalFields or another schema you need
// const schema = joi.object(generalFields);

export const isValid = (schema) => {
  return (req, res, next) => {
    let data = { ...req.body, ...req.params, ...req.query }; // Corrected from 'date' to 'data'
    const { error } = schema.validate(data, { abortEarly: false }); // Corrected from 'errro' to 'error'
    if (error) {
      const errArr = []
      error.details.forEach((err)=>{errArr.push(err.message)})
      return next(new AppError(errArr, 400));
    }
    next();
  };
};
