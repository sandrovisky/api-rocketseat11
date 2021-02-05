import User from '../models/User'
import AppError from '../error/AppError'

import { getRepository } from 'typeorm'
import { hash }from 'bcryptjs'

interface Request {
    name: string
    email: string
    password: string
}

export default class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User>{
        const userRepository = getRepository(User)

        const checkUserExists = await userRepository.findOne({
            where: { email }
        })

        if (checkUserExists) {
            throw new AppError ('Email adress already used')
        }

        const hashedPassword = await hash(password, 8)

        const user = userRepository.create({
            name,
            email,
            password: hashedPassword
        })

        await userRepository.save(user)

        return user
    }  
}