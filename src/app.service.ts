import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private isReady = true; // Inizializza come ready per i container check
  /**
   * Controlla se l'applicazione è pronta a ricevere traffico
   * Deve essere veloce per i container healthcheck
   */
  async isApplicationReady(): Promise<boolean> {
    try {
      // Controlli rapidi e essenziali
      const checks = await Promise.allSettled([this.checkMemoryUsage()]);

      // Se tutti i controlli passano, l'app è ready
      return checks.every(
        (check) => check.status === 'fulfilled' && check.value === true,
      );
    } catch (error) {
      console.error('Readiness check failed:', error);
      return false;
    }
  }

  /**
   * Controlla l'utilizzo della memoria
   */
  private async checkMemoryUsage(): Promise<boolean> {
    try {
      const memUsage = process.memoryUsage();
      const memUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

      // Se la memoria supera il 90%, considera l'app non ready
      return memUsagePercent < 90;
    } catch (error) {
      console.error('Memory check failed:', error);
      return false;
    }
  }

  getSystemMetrics() {
    const memUsage = process.memoryUsage();

    return {
      memory: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss,
      },
      uptime: process.uptime(),
      pid: process.pid,
      version: process.version,
      platform: process.platform,
      arch: process.arch,
    };
  }

  async shutdown(): Promise<void> {
    this.isReady = false;
    console.log('Application shutting down gracefully');
  }
}
