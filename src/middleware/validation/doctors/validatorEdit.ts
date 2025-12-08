import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Doctor } from 'orm/entities/doctor/Doctor';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  let { Doctor_fullname, Doctor_number, Specialty_name } = req.body;
  const errorsValidation: ErrorValidation[] = [];
  const doctorRepository = getRepository(Doctor);

  Doctor_fullname = !Doctor_fullname ? '' : Doctor_fullname;
  Doctor_number = !Doctor_number ? '' : Doctor_number;
  Specialty_name = !Specialty_name ? '' : Specialty_name;

  const doctor = await doctorRepository.findOne({ where: { id: req.params.id } });
  if (doctor) {
    errorsValidation.push({ id: `Doctor with ID '${req.params.id}' already exists` });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Edit doctor validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};