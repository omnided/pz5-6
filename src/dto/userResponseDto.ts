import { User } from "orm/entities/users/User";

export class userResponseDto {
    id: number;
    email: string;
    name: string;
    role: string;

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
        this.role = user.role;
    }
};
