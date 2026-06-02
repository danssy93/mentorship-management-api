const configuration = () => ({
  DATABASE: {
    TYPE: process.env.DATABASE_TYPE,
    HOST: process.env.DATABASE_HOST,
    PORT: parseInt(process.env.DATABASE_PORT || '3306'),
    USERNAME: process.env.DATABASE_USERNAME,
    PASSWORD: process.env.DATABASE_PASSWORD,
    NAME: process.env.DATABASE_NAME,
  },
});

export default configuration;
