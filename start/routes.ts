/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/onichan", "MusicController.show");
  Route.post("/onichan", "MusicController.create");
  Route.delete("/onichan/:id", "MusicController.destroy");
})
  .prefix("api/v1")
  .middleware("lenguage");

Route.get("errors/:rule", "MusicController.infoFromErrors").middleware(
  "lenguage"
);
