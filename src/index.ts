import { logger } from './logging.service';
import { config } from './config';
import { server } from './server';

process.on('SIGINT', () => {
    logger.info({ action: 'interupt' });
    process.exit(0);
});

try {
    config();
    server();
} catch (error) {
    logger.error(error);
    process.exit(1);
}
