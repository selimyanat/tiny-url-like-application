import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        Logger.log('error', validationErrors);
        const formatError = (error: ValidationError) => {
          if (error.children?.length) {
            return {
              field: error.property,
              errors: error.children.map(formatError),
            };
          }
          return {
            field: error.property,
            errors: Object.values(error.constraints ?? {}),
          };
        };

        return new BadRequestException(
          validationErrors.map((error) => formatError(error)),
        );
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port).then(() => Logger.log(`Server started on ${port}`));
}

bootstrap();
