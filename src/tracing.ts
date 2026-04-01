// src/tracing.ts - Solo instrumentations necessarie
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NodeSDK } from '@opentelemetry/sdk-node';

const sdk = new NodeSDK({
  instrumentations: [
    new HttpInstrumentation({
      ignoreIncomingRequestHook: (req) => {
        const url = req.url || '';
        return url.includes('/health') || url.includes('/actuator');
      },
    }),
    new ExpressInstrumentation(),
  ]
});

sdk.start();

console.log('🔍 OpenTelemetry started with manual instrumentations');

export default sdk;