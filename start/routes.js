"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.get("/onichan", "MusicController.show");
    Route_1.default.post("/onichan", "MusicController.create");
    Route_1.default.delete("/onichan/:id", "MusicController.destroy");
})
    .prefix("api/v1")
    .middleware("lenguage");
Route_1.default.get("errors/:rule", "MusicController.infoFromErrors").middleware("lenguage");
//# sourceMappingURL=routes.js.map