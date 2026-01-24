import app from "./app.js";

const start = async () => {
    try {
        await app.listen({
            port: 3001,
            host: '127.0.0.1',
        });
        app.log.info('Server running on http://127.0.0.1:3001');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
