import { NestFactory } from "@nestjs/core";
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("Api Ajinomoto")
    .setVersion("1.0")
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup("api", app, document);
  console.log("process.env.PORT", process.env.PORT);
  console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  console.log("process.env.MONGODB_URL", process.env.MONGODB_URL);  
  await app.listen(process.env.PORT || 3200);
}
bootstrap();
