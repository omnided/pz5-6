import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreate = (req: Request, res: Response, next: NextFunction) => {
  let { doctor_fullname, doctor_number, specialty_id } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  doctor_fullname = !doctor_fullname ? '' : doctor_fullname.toString().trim();
  doctor_number = !doctor_number ? '' : doctor_number.toString().trim();
  specialty_id = !specialty_id ? '' : specialty_id;

  if (!validator.isLength(doctor_fullname, { min: 1, max: 40 })) {
    errorsValidation.push({ doctor_fullname: 'Doctor_fullname must be between 1 and 40 characters' });
  }

  if (!validator.isMobilePhone(doctor_number, 'any', { strictMode: false })) {
    errorsValidation.push({ doctor_number: 'Doctor_number must be a valid phone number' });
  }

  if (!validator.isLength(specialty_id, { min: 1, max: 30 })) {
    errorsValidation.push({ specialty_name: 'Specialty_name must be between 1 and 30 characters' });
  }

  if (validator.isEmpty(doctor_fullname)) {
    errorsValidation.push({ doctor_fullname: 'Doctor_fullname is required' });
  }

  if (validator.isEmpty(doctor_number)) {
    errorsValidation.push({ doctor_number: 'Doctor_number is required' });
  }

  if (validator.isEmpty(specialty_id)) {
    errorsValidation.push({ specialty_name: 'Specialty_name is required' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Create doctor validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};
