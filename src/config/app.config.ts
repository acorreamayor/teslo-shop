

export const EnvConfiguration = () => ({
    enviroment: process.env.MODE_ENV,

    dbhost: process.env.DB_HOST,
    dbport: process.env.DB_PORT,
    dbdatabase: process.env.DB_NAME,
    dbusername: process.env.DB_USERNAME,

    port: process.env.PORT,
    default_limit: +(process.env.DEFAULT_LIMIT || 10),

    host_api: process.env.HOST_API


});

