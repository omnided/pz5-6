import {Request, Response, NextFunction} from 'express';
import MedcardService from 'service/MedcardService';
import { MedcardResponseDto } from 'dto/medcardResponseDto';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const medcardService = new MedcardService();

  try {
    const medcards = await medcardService.findAll();
    const medcardDtos = medcards.map(medcard => new MedcardResponseDto(medcard));
    res.customSuccess(200, 'List of medcards.', medcardDtos);
  } catch (error) {
    return next(error);
  }
};