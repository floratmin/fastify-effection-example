// Main function to strap everything up
import {main, suspend} from 'effection';
import {boom, buildFastify, startServer} from './server.ts';
import {Kysely, PostgresDialect} from 'kysely';
import pg from 'pg';
import {fileURLToPath} from 'node:url';

if (process.argv[1] === fileURLToPath(import.meta.url)) {

    const {Pool} = pg;

    await main(function* () {
        let log: Console | undefined;
        try {
            const {fastify, port} = yield* buildFastify(Pool, Kysely, PostgresDialect);
            log = <Console><unknown>fastify.log;

            yield* startServer(port, fastify, process.env.NODE_ENV ? !(process.env.NODE_ENV !== 'development') : true);

            if (process.env.BOOM === 'server') {
                yield* boom(5000);
            }

            yield* suspend();
        } catch(e) {
            if (!log) {
                log = console;
            }
            log.error((e as Error).message);
        } finally {
            if (!log) {
                log = console;
            }
            log.info('Started to close all processes.');
        }
    });

}
