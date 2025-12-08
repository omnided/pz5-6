import { Request, Response, NextFunction } from 'express';
import MedcardService from 'service/MedcardService';

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  const medcardService = new MedcardService();
  const id = Number(req.params.id);

  try {
    await medcardService.delete(id);
    res.customSuccess(200, 'Medcard successfully deleted.');
  } catch (error) {
    return next(error);
  }
};