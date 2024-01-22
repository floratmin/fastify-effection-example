import {FastifyInstance} from 'fastify';
import {InferResult} from 'kysely';
import {call} from 'effection';

export async function routesBenchmark(fastify: FastifyInstance) {
    const scope = fastify.scopes.getScope('main');

    // run without scope and without db
    fastify.get('/benchmark/no/no', () => {
        return {hello: 'user'};
    });
    // run with scope and without db
    fastify.get('/benchmark/sc/no', (_, reply) => {
        scope.run(function* () {
            yield* call(async() => {
                reply.send({hello: 'user'});
            });
        });
    });
    fastify.get('/benchmark/sc/no/rollback', (_, reply) => {
        let interrupted = true;
        scope.run(function* (){
            try {
                interrupted = false;
                reply.send({hello: 'scope with rollback native'});
            } finally {
                if (interrupted) {
                    fastify.log.info('Handler was interrupted. Cleaning up...');
                    reply.code(500).send({statusCode: 500, "error": "Internal Server Error", "message": "Server Error"});
                }
            }
        });
    });
    // run without scope and with db
    fastify.get('/benchmark/no/db', async () => {
        const user = await fastify.db.selectFrom('users').selectAll().executeTakeFirst();
        return {hello: user?.name};
    });
    // run with scope and with db
    fastify.get('/benchmark/sc/db', (_, reply) => {
        scope.run(function* () {
            const userQuery = fastify.db.selectFrom('users').selectAll().compile();
            const users: InferResult<typeof userQuery> = (yield* fastify.getQueryResults(userQuery)).rows;
            reply.send({hello: users[0]?.name});
        });
    });

}

