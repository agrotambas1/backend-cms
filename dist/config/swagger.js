"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const swaggerDefinition = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "LG Sinarmas CMS API",
            version: "1.0.0",
            description: "API documentation for LG Sinarmas CMS",
        },
        servers: [{ url: "http://localhost:4000" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: [
        path_1.default.join(__dirname, "../routes/cms/**/*.ts"),
        // path.join(__dirname, "../routes/public/**/*.ts"),
        path_1.default.join(__dirname, "../docs/schemas/*.yaml"),
    ],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerDefinition);
//# sourceMappingURL=swagger.js.map