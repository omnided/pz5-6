import { Request, Response, NextFunction } from 'express';
import MedcardService from 'service/MedcardService';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const medcardService = new MedcardService();
  const id = Number(req.params.id);
  const { patient_id, medcard_chronic, medcard_createdate, medcard_bloodtype } = req.body;

  try {
    const medcard = await medcardService.update(id, {
      patient_id,
      medcard_chronic,
      medcard_createdate,
      medcard_bloodtype
    });
    res.customSuccess(200, 'Medcard successfully updated.', medcard);
  } catch (error) {
    return next(error);
  }
};