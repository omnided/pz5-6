import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';
import MedcardService from 'service/MedcardService';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { patient_id, medcard_chronic, medcard_createdate, medcard_bloodtype } = req.body;
  const medcardService = new MedcardService();
  try {
    const medcard = await medcardService.create({
      patient_id,
      medcard_chronic,
      medcard_createdate,
      medcard_bloodtype
    });
    res.customSuccess(201, 'Medcard successfully created.', {
      id: medcard.id,
      patient_id: medcard.patient_id,
      medcard_chronic: medcard.medcard_chronic,
      medcard_createdate: medcard.medcard_createdate,
      medcard_bloodtype: medcard.medcard_bloodtype
    });
    } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    }
    
    const customError = new CustomError(500, 'Raw', 'Doctor creation failed', null, error);
    return next(customError);
  }
};