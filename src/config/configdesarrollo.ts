
export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        type: 'mysql',
            host: process.env.DB_HOST,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE_DESARROLLO,
            entities: ["dist/**/*.entity{.ts,.js}"],
            autoLoadEntities:true,
            synchronize: true,
            charset: 'utf8',
            keepConnectionAlive:true
    }
  });