import { registerAs } from '@nestjs/config';

const userApiConfig = () => ({
  port: process.env.USER_API_PORT || 8001,
});

export const userConfig = registerAs('userApiConfig', userApiConfig);
