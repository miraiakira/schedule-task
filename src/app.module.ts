import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskService } from './task.service';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { AaaModule } from './aaa/aaa.module';
import { CronJob } from 'cron';

@Module({
  imports: [ScheduleModule.forRoot(), AaaModule],
  controllers: [AppController],
  providers: [AppService, TaskService],
})
export class AppModule implements OnApplicationBootstrap {
  @Inject(SchedulerRegistry)
  private scheduleRegistry: SchedulerRegistry;

  onApplicationBootstrap() {
    const crons = this.scheduleRegistry.getCronJobs();

    crons.forEach((item, key) => {
      item.stop();
      this.scheduleRegistry.deleteCronJob(key);
    });

    const intervals = this.scheduleRegistry.getIntervals();

    intervals.forEach((item) => {
      const interval = this.scheduleRegistry.getInterval(item);
      clearInterval(interval);

      this.scheduleRegistry.deleteInterval(item);
    });

    const timeouts = this.scheduleRegistry.getTimeouts();

    timeouts.forEach((item) => {
      const timeout = this.scheduleRegistry.getTimeout(item);
      clearTimeout(timeout);

      this.scheduleRegistry.deleteTimeout(item);
    });

    console.log('cron jobs: ', this.scheduleRegistry.getCronJobs());
    console.log('intervals: ', this.scheduleRegistry.getIntervals());
    console.log('timeouts: ', this.scheduleRegistry.getTimeouts());

    const job = new CronJob(`0/5 * * * * *`, () => {
      console.log('cron job');
    });

    this.scheduleRegistry.addCronJob('job1', job);
    job.start();

    const interval = setInterval(() => {
      console.log('interval job');
    }, 3000);

    this.scheduleRegistry.addInterval('job2', interval);

    const timeout = setTimeout(() => {
      console.log('timeout job');
    }, 5000);
    this.scheduleRegistry.addTimeout('job3', timeout);
  }
}
