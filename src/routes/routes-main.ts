import {FastifyInstance} from 'fastify';

export async function mainRoutes(fastify: FastifyInstance) {

    fastify.get('/', () => ({hello: 'world'}));

    fastify.get('/schema', {
        handler: ()  => {
            return {hello: 'world'};
        },
        schema: {
            tags: ['Hello'],
            description: 'Get Greeting',
            response: {
                '2xx': {
                    $ref: 'http://hello-schema.com#',
                }
            },
        },
    });

    fastify.get('/schema/scope', {
        handler: () => fastify.scopes.getScope('main').run(function* () {
            return {hello: 'world'};
        }),
        schema: {
            tags: ['Hello'],
            description: 'Get Greeting',
            response: {
                '2xx': {
                    $ref: 'http://hello-schema.com#',
                }
            },
        },
    });

    function getScoped(path: string, handler: () => any) {
        fastify.get(path, () => fastify.scopes.getScope('main').run(function* () {
            return handler();
        }));
    }
    fastify.decorate('getScoped', getScoped);

    fastify.getScoped('/schema/getScoped', () => ({hello: 'world'}));

}
