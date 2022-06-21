import { registerAs } from '@nestjs/config';

interface IUrlPath {
  userApiUrl: string;
}

interface IAuthConfig {
  port: number;
  url: IUrlPath;
}

const authCongig = (): IAuthConfig => ({
  port: Number(process.env.AUTH_API_PORT) || 9000,
  url: {
    userApiUrl: process.env.USER_API_URL,
  },
});

export const authApiConfig = registerAs('authApiConfig', authCongig);
