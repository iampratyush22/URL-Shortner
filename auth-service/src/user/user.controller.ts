import { Request, Response } from "express";
import { LoginUserDTO, RegisterUserDTO, UserServiceInterface } from "./user.service";
export interface UserControlerType {
    register(req: Request, res: Response): void,
    login(req: Request, res: Response): void
}

export class UserController implements UserControlerType {
    constructor(private userService: UserServiceInterface) {
    }
    async register(req: Request, res: Response) {
        try {
            console.log('Request hit register');
            const dto: RegisterUserDTO = {
                name: req.body?.name,
                email: req.body?.email,
                password: req.body?.password,
            }
            const userData = await this.userService.register(dto);
            res.status(200).json({
                success: true,
                message: 'register succesfully',
                data: userData,
            });

        } catch (error) {
            //@ts-ignore
            const message = error.message || 'Something went wrong'
            // console.log(...)
            res.status(500).json({
                success: false,
                message,
            })

        }
    }
    async login(req: Request, res: Response) {
        try {
            // console.log(...)
            const dto: LoginUserDTO = {
                email: req.body?.email,
                password: req.body?.password,
            }
            const userData = await this.userService.login(dto);
            return res.status(200).json({
                success: true,
                message: 'login succesfully',
                data: userData,
            });

        } catch (error) {
            //@ts-ignore
            const message = error?.message || 'Something went wrong';
            res.status(500).json({
                success: false,
                message
            })
        }


    }

}