import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const MikroOrmConfig = defineConfig({
  driver: PostgreSqlDriver,
  dbName: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  highlighter: new SqlHighlighter(),
  logger: console.log.bind(console),
  debug: process.env.NODE_ENV === 'development',
  replicas: [],
  allowGlobalContext: true,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
});

export default MikroOrmConfig;
