export interface ILocketData {
    clientEmitMSec: number;
    logLevel: ELogLevels;
    msg: string;
    args: unknown[];
    serverEmitMSec?: number;
}

export enum ELogLevels {
    'DEBUG' = 'debug',
    'LOG' = 'log',
    'INFO' = 'info',
    'WARN' = 'warning',
    'ERROR' = 'error',
}

export enum ECommands {
    'HASTE' = 'haste',
    'RESUME' = 'resume',
}
