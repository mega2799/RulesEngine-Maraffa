import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Rotta principale per healthcheck del container
  @Get('health')
  getHealth(@Res() res: Response) {
    const healthCheck = {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };

    res.status(HttpStatus.OK).json(healthCheck);
  }

  // Rotta Spring Boot style - priorità massima per il container
  @Get('actuator/health')
  getActuatorHealth(@Res() res: Response) {
    try {
      const healthCheck = {
        status: 'UP',
        components: {
          ping: {
            status: 'UP',
          },
          diskSpace: {
            status: 'UP',
            details: {
              total: this.getSystemInfo().disk.total,
              free: this.getSystemInfo().disk.free,
              threshold: this.getSystemInfo().disk.threshold,
            },
          },
        },
        groups: ['liveness', 'readiness'],
      };

      res.status(HttpStatus.OK).json(healthCheck);
    } catch (error) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'DOWN',
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    }
  }

  // Liveness probe - stile Spring Boot Actuator
  @Get('actuator/health/liveness')
  getLiveness(@Res() res: Response) {
    res.status(HttpStatus.OK).json({
      status: 'UP',
      groups: ['liveness'],
    });
  }

  // Readiness probe - stile Spring Boot Actuator
  @Get('actuator/health/readiness')
  async getReadiness(@Res() res: Response) {
    try {
      const isReady = await this.appService.isApplicationReady();

      if (isReady) {
        res.status(HttpStatus.OK).json({
          status: 'UP',
          components: {
            readinessState: {
              status: 'UP',
            },
          },
          groups: ['readiness'],
        });
      } else {
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
          status: 'DOWN',
          components: {
            readinessState: {
              status: 'DOWN',
            },
          },
        });
      }
    } catch (error) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'DOWN',
        error: error.message,
      });
    }
  }

  // Metrics endpoint
  @Get('actuator/metrics')
  getMetrics(@Res() res: Response) {
    res.status(HttpStatus.OK).json(this.appService.getSystemMetrics());
  }

  // Info endpoint - stile Spring Boot
  @Get('actuator/info')
  getInfo(@Res() res: Response) {
    const info = {
      app: {
        name: process.env.npm_package_name || 'nestjs-app',
        version: process.env.npm_package_version || '1.0.0',
        description:
          process.env.npm_package_description || 'NestJS Application',
      },
      build: {
        time: new Date().toISOString(),
        node: process.version,
      },
      git: {
        // Questi possono essere iniettati durante il build
        branch: process.env.GIT_BRANCH || 'unknown',
        commit: process.env.GIT_COMMIT || 'unknown',
      },
    };

    res.status(HttpStatus.OK).json(info);
  }

  private getSystemInfo() {
    const memUsage = process.memoryUsage();

    return {
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        total: Math.round(memUsage.heapTotal / 1024 / 1024),
        unit: 'MB',
      },
      disk: {
        total: '100GB', // Placeholder - in produzione usa fs.statSync
        free: '50GB', // Placeholder
        threshold: '10GB',
      },
      uptime: process.uptime(),
      pid: process.pid,
    };
  }
}
