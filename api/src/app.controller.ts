import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // return a json object with a field called shorted-url
    return this.appService.createTinyURL('https://zapper.xyz');
  }
}
