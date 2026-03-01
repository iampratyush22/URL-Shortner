import { UserModel } from "../models/user.model";
import bcrypt from "bcrypt";
import { RegisterUserDTO } from "./user.service";

export interface UserRepoInterface {
    createUser(userData: UserData): Promise<any>,
    findEmail(email: string): Promise<any>,
}

export interface UserData {
    email: string,
    password: string,
}
export class UserReop implements UserRepoInterface {
    async createUser(userData: RegisterUserDTO): Promise<any> {
        //hash the password
        const hashPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await UserModel.create({
            name: userData.name,
            email: userData.email,
            password: hashPassword,
        });
        //@ts-ignore
        const { password: _, ...data } = newUser?._doc;
        return data;
    }
    async findEmail(email: string): Promise<any> {
        const user = await UserModel.findOne({ email });
        return user;
    }
}