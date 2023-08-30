import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { AaaService } from './aaa/aaa.service';

@Injectable()
export class TaskService {
  @Inject(AaaService)
  private aaaService: AaaService;

  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: 'task1',
    timeZone: 'Asia/Tokyo',
  })
  handleCron() {
    console.log('task executed: ', this.aaaService.findAll());
  }

  @Interval('task2', 500)
  task2() {
    console.log('taks2');
  }

  @Timeout('taks3', 3000)
  task3() {
    console.log('task3');
  }
}
