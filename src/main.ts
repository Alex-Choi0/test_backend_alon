import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //웹 페이지를 새로고침을 해도 Token 값 유지
  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  // Swagger Document를 설정
  const options = new DocumentBuilder()
    .setTitle(` [아론] 소프트웨어 개발 채용_코딩 과제 - 백엔드 : ${process.env.BACKEND_SETTING}`)
    .setVersion('1.0')
    .addBearerAuth()
    .setDescription(
      `
      개발자 : 최재호

      사양
      - node : v24.14.0
      - nestjs : 11.0.16
    `,
    )
    .setExternalDoc(
      'GitHub Link',
      'https://github.com/Alex-Choi0/test_backend_alon.git',
    )
    .build();

  // Swagger Document의 문서를 api(/api-docs)로 설정할수 있게 셋팅
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document, swaggerCustomOptions);
  // app.use('/swagger-ui', express.static(extraPath));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  console.log('current dir : ', __dirname);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
