import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { userResponseDto } from 'dto/userResponseDto';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = getRepository(User);
  try {
    const users = await userRepository.find({
      select: ['id', 'username', 'name', 'email', 'role', 'language', 'created_at', 'updated_at'],
    });
    const userDtos = users.map(user => new userResponseDto(user));
    res.customSuccess(200, 'List of users.', userDtos);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of users.`, null, err);
    return next(customError);
  }
};
