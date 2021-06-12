export interface IJwtPaiload {
    id: string;
    username: string;
    email: string;
    roles: string[];
    iat?: Date;
}

