"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_js_1 = require("./app.module.js");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_js_1.AppModule);
    app.enableCors();
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'public'));
    await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
//# sourceMappingURL=main.js.map