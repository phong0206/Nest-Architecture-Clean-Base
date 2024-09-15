import { User } from '@entity/user.entity';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readdirSync } from 'fs';
import { join } from 'path';

export async function useSwagger(app: INestApplication) {
  const logger = new Logger('Swagger');
  const port = +process.env.PORT || 3000;
  const path = 'api';
  const title = 'Nest Architecture Clean Base';
  const version = '1.0';

  const entitiesPath = join(__dirname, '../src/infrastructure/entities/');
  const entityFiles = readdirSync(entitiesPath);

  // const extraModels = await Promise.all(
  //   entityFiles.map(async (file) => {
  //     const entityModule = await import(join(entitiesPath, file));
  //     return entityModule.default || entityModule;
  //   }),
  // );
  // const en = await import(join(entitiesPath, '/admin.entity.ts'));
  console.log(123);
  const config = new DocumentBuilder().setTitle(title).setVersion(version).addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config, {
    // extraModels: extraModels.flat(),
  });

  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: (a, b) => {
        const methodsOrder = ['get', 'post', 'put', 'patch', 'delete', 'options', 'trace'];
        let result = methodsOrder.indexOf(a.get('method')) - methodsOrder.indexOf(b.get('method'));

        if (result === 0) {
          result = a.get('path').localeCompare(b.get('path'));
        }

        return result;
      },
    },
  });
  logger.log(`Your documentation is running on http://localhost:${port}/${path}`);
}
