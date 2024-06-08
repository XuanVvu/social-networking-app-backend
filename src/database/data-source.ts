import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Xuanvu0307@',
  database: 'posts',
  entities: ['dist/**/**/*.entity{.js, .ts}'],
  migrations: ['dist/database/migrations/*{.js, .ts}'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
