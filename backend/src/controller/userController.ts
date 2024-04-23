import { Request, Response } from 'express';
import { userService } from '../service/userService';
import { encryptPassword, validatePassword } from '../utils/utils';
import { responseBase } from 'shared';
import jwt from 'jsonwebtoken';

const registerUser = async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    const emailAvailable = await userService.checkEmailAvailability(email);

    if (!emailAvailable) {
        const response = responseBase.parse({
            error: {
                msg: 'Email already taken',
            },
            code: '400',
            payload: {},
        });

        res.json(response);
        return;
    }

    const hashedPassword = await encryptPassword(password);

    const user = await userService.createUser({
        email,
        username,
        password: hashedPassword,
    });

    const response = responseBase.parse({
        error: {
            msg: '',
        },
        code: '200',
        payload: {
            email: user.email,
            username: user.username,
        },
    });

    res.json(response);
};

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await userService.getUserByEmail(email);
    
    if (!user) {
        const response = responseBase.parse({
            error: {
                msg: 'Invalid email or password',
            },
            code: '400',
            payload: {},
        });
        
        res.json(response);
        return;
    }
    
    const isValid = await validatePassword(password, user.password);
    
    if (!isValid) {
        const response = responseBase.parse({
            error: {
                msg: 'Invalid email or password',
            },
            code: '400',
            payload: {},
        });
        
        res.json(response);
        return;
    }
    
    const response = responseBase.parse({
        error: {
            msg: '',
        },
        code: '200',
        payload: {
            userId: user.id,
            username: user.username,
            type: user.type,
        },
    });

    const token = jwt.sign({ userId: user.id, username: user.username, type:user.type }, process.env.JWT_SECRET!);

    res.cookie('token', token, { httpOnly: true });
    res.json(response);
};

const userController = {
    registerUser,
    loginUser,
};

export { userController };