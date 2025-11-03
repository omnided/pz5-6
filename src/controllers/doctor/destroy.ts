import { Request, Response, NextFunction } from 'express';
import DoctorService from 'service/DoctorService';

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  const doctorService = new DoctorService();
  const id = Number(req.params.id);

  try {
    await doctorService.delete(id);
    res.customSuccess(200, 'Doctor successfully deleted.');
  } catch (error) {
    return next(error);
  }
};