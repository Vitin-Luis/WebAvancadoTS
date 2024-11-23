import jwt from "jsonwebtoken";

interface User{
    email: string,
    password: string
}

const privateKey = 'abneeeer';

export async function generateJWToken(user: User) {
    const token = jwt.sign(user, privateKey, { algorithm: "HS256" });
    return token;
}
