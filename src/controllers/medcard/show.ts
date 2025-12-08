import MedcardService from 'service/MedcardService';
import { MedcardResponseDto } from 'dto/medcardResponseDto';
import { Request, Response, NextFunction } from 'express';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const medcardService = new MedcardService();
  const id = Number(req.params.id);

  try {
    const medcard = await medcardService.findById(id);
    const medcarddto = new MedcardResponseDto(medcard);
    res.customSuccess(200, 'Medcard found.', medcarddto);
  } catch (error) {
    return next(error);
  }
};