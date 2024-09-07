import { globalErrorHandling } from "./utils/appError.js";
import { brandRouter, categoryRouter,subcategoryRouter } from "./modules/index.js";

export const bootStrap = (app,express) => {
  // parse req
  app.use(express.json());
  // public foilder
  app.use('/uploads',express.static('uploads'))
  // routing
  app.use('./catehory',categoryRouter)
  app.use('./subcategory',subcategoryRouter)
  app.use('./brand',brandRouter)
  // golabl error handler
  app.use(globalErrorHandling)
}