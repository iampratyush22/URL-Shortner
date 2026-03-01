import { z, ZodError } from "zod";
import { loginUserValidator, registerUserValidator, userData } from "./user.types";
export interface UserValidatorInterface {
    validate(userData: userData, validator: any): void,
    validateRegister(userData: userData): void,
    validateLogin(userData: userData): void,
}




export class UserValidator implements UserValidatorInterface {
    validateRegister(userData: userData) {
        this.validate(userData, registerUserValidator);
    }
    validateLogin(userData: userData) {
        this.validate(userData, loginUserValidator);
    }
    validate(userData: userData, validateUser: any) {
        if (!userData) {
            throw new Error('Please enter valid email and password');
        }
        const parsed = validateUser.safeParse(userData);
        if (!parsed.success) {
            // console.log(...)
            const fieldsError = parsed.error;
            const message = fieldsError.message;
            throw new Error(message.toString());
        }
    }

}