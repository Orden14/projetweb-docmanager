export function getRedisConnection(): object {
    return {
        host: process.env.REDIS_HOST ?? 'redis',
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        username: process.env.REDIS_USERNAME ?? undefined,
        password: process.env.REDIS_PASSWORD ?? undefined,
    };
}
