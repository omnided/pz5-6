import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorPatientCreate = (req: Request, res: Response, next: NextFunction) => {
  let { 
    patient_fullname, 
    patient_sex, 
    patient_address, 
    patient_registerdate, 
    patient_number, 
    patient_birthdaydate 
  } = req.body;
  
  const errorsValidation: ErrorValidation[] = [];

  patient_fullname = !patient_fullname ? '' : patient_fullname.toString().trim();
  patient_sex = !patient_sex ? '' : patient_sex.toString().trim();
  patient_address = !patient_address ? '' : patient_address.toString().trim();
  patient_registerdate = !patient_registerdate ? '' : patient_registerdate.toString();
  patient_number = !patient_number ? '' : patient_number.toString().trim();
  patient_birthdaydate = !patient_birthdaydate ? '' : patient_birthdaydate.toString();

  if (validator.isEmpty(patient_fullname)) {
    errorsValidation.push({ patient_fullname: 'Patient fullname is required' });
  } else if (!validator.isLength(patient_fullname, { min: 1, max: 40 })) {
    errorsValidation.push({ patient_fullname: 'Patient fullname must be between 1 and 40 characters' });
  }

  if (validator.isEmpty(patient_sex)) {
    errorsValidation.push({ patient_sex: 'Patient sex is required' });
  } else if (!['male', 'female', 'other'].includes(patient_sex)) {
    errorsValidation.push({ patient_sex: 'Patient sex must be one of: male, female, other' });
  }

  if (patient_address && !validator.isLength(patient_address, { min: 0, max: 30 })) {
    errorsValidation.push({ patient_address: 'Patient address must be maximum 30 characters' });
  }

  if (validator.isEmpty(patient_registerdate)) {
    errorsValidation.push({ patient_registerdate: 'Patient register date is required' });
  } else if (!validator.isDate(patient_registerdate)) {
    errorsValidation.push({ patient_registerdate: 'Patient register date must be a valid date' });
  }

  if (patient_number) {
    if (!validator.isLength(patient_number, { min: 0, max: 20 })) {
      errorsValidation.push({ patient_number: 'Patient number must be maximum 20 characters' });
    } else if (!validator.isMobilePhone(patient_number, 'any', { strictMode: false })) {
      errorsValidation.push({ patient_number: 'Patient number must be a valid phone number' });
    }
  }

  if (validator.isEmpty(patient_birthdaydate)) {
    errorsValidation.push({ patient_birthdaydate: 'Patient birthday date is required' });
  } else if (!validator.isDate(patient_birthdaydate)) {
    errorsValidation.push({ patient_birthdaydate: 'Patient birthday date must be a valid date' });
  }

  if (patient_birthdaydate && validator.isDate(patient_birthdaydate)) {
    const birthDate = new Date(patient_birthdaydate);
    const today = new Date();
    if (birthDate > today) {
      errorsValidation.push({ patient_birthdaydate: 'Patient birthday date cannot be in the future' });
    }
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400, 
      'Validation', 
      'Create patient validation error', 
      null, 
      null, 
      errorsValidation
    );
    return next(customError);
  }
  
  return next();
};