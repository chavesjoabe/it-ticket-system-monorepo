import { registerAs } from '@nestjs/config';

interface IUrlPaths {
  userApiUrl: string;
}

interface ITicketConfig {
  port: number;
  url: IUrlPaths;
}

const ticketconfig = (): ITicketConfig => ({
  port: Number(process.env.TICKET_API_PORT) || 8000,
  url: {
    userApiUrl: process.env.USER_API_URL,
  },
});

export const ticketApiConfig = registerAs('ticketApiConfig', ticketconfig);
