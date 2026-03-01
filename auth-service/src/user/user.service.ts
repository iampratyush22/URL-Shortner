import { PRIVATE_KEY } from "../utils/constant.utils";
import { UserRepoInterface } from "./user.repo";
import { UserValidatorInterface } from "./user.validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface RegisterUserDTO {
    name: string,
    email: string,
    password: string,
}
export interface LoginUserDTO extends Omit<RegisterUserDTO, "name"> {

}

export interface UserServiceInterface {
    register(userData: RegisterUserDTO): void
    login(userData: LoginUserDTO): Promise<any>
}

export class UserService implements UserServiceInterface {
    constructor(private validator: UserValidatorInterface, private repo: UserRepoInterface) { }
    async register(userData: RegisterUserDTO) {
        //validate
        this.validator.validateRegister(userData);
        //
        const data = await this.repo.findEmail(userData.email);
        if (data) {
            throw new Error('Email already registered');
        };
        const user = await this.repo.createUser(userData);
        const token = jwt.sign({
            sub: user._id,
            ...user,
        }, PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'auth-service',
        });
        return { token, user };
    }
    async login(userData: LoginUserDTO): Promise<any> {
        this.validator.validateLogin(userData);
        const data = await this.repo.findEmail(userData.email);
        if (!data) {
            throw new Error('Email not registered');
        }
        //@ts-ignore
        const { password, ...user } = data?._doc;
        const isPasswordValid = await bcrypt.compare(userData.password, password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentails');
        }
        //generate the jwt token
        const token = jwt.sign({
            sub: user._id,
            ...user,
        }, PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'auth-service',
        });
        return { token, user };
    }
}