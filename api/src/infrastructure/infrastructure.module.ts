import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShortenUrlRepository } from '../shorten-url/shorten-url.repository';
import { RepositoryProvider } from './repository/repository.provider';

@Module({
  imports: [ConfigModule], // ✅ Ensure ConfigModule is loaded
})
export class InfrastructureModule {
  static register(): DynamicModule {
    return {
      module: InfrastructureModule,
      providers: [RepositoryProvider],
      exports: [ShortenUrlRepository], // ✅ Export repository so other modules can use it
    };
  }
}
