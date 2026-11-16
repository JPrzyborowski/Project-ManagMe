import bscypt from "bcryptjs";

export type User = {
    id: string;
    login: string;
    passwordHash: string;
    role: "admin" | "devops" | "developer"
}; 


export const users: User[] = [
    {
        id: "user-1",
        login: "admin",
        passwordHash: bscypt.hashSync("admin123", 10),
        role: "admin"
    }
];