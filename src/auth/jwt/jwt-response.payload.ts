

export interface JwtResponsePayload {

    phoneNumber: string;

    sub: string;

    iat: number;

    exp: number;

    iss: string;
}