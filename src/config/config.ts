
export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        type: 'mysql',
            host: process.env.DB_HOST,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: ["dist/**/*.entity{.ts,.js}"],
            // migrations: [
            //     'src/database/migrations/*{.ts,.js}',
            // ],
            // migrationsTableName: 'migrations_typeorm',
            // logging: true,
            // migrationsRun: true,
            autoLoadEntities:true,
            synchronize: true,
            charset: 'utf8',
            keepConnectionAlive:true
    },

    database2: {
        type: 'mysql',
            host: process.env.DB_HOST,
            username: 'root',
            password: process.env.DB_PASSWORD,
            database: 'desarrollo',
            entities: ["dist/**/*.entity{.ts,.js}"],
            autoLoadEntities:false,
            synchronize: false,
            charset: 'utf8',
            keepConnectionAlive:true
    }
    
  });