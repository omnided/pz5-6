# Медична система

## 📋 Сутності та зв'язки

### 1. **Patient (Пацієнт)**

**Атрибути:**
- `id` - унікальний ідентифікатор
- `patient_fullname` - ПІБ пацієнта (40 символів, унікальний)
- `patient_sex` - стать ('male', 'female', 'other')
- `patient_address` - адреса (30 символів, опціонально)
- `patient_registerdate` - дата реєстрації
- `patient_number` - номер телефону (20 символів, унікальний, опціонально)
- `patient_birthdaydate` - дата народження

**Зв'язок:** `One-to-Many` з Medcard

### 2. **Medcard (Медична карта)**

**Атрибути:**
- `id` - унікальний ідентифікатор
- `patient_id` - зовнішній ключ до Patient
- `medcard_chronic` - хронічні захворювання (50 символів, опціонально)
- `medcard_createdate` - дата створення картки
- `medcard_bloodtype` - група крові ('O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+')

**Зв'язок:** `Many-to-One` з Patient

### 3. **Doctor (Лікар)**

**Атрибути:**
- `id` - унікальний ідентифікатор
- `doctor_fullname` - ПІБ лікаря
- `doctor_number` - номер телефону
- `specialty_id` - зовнішній ключ до Specialty

### 4. **Specialty (Спеціальність)**

**Атрибути:**
- `id` - унікальний ідентифікатор  
- `specialty_name` - назва спеціальності

**Зв'язок:** `One-to-Many` з Doctor

## 🌐 API Ендпоінти

### **Пацієнти (Patients)**

- `GET /patients` - отримати список пацієнтів
- `GET /patients/:id` - отримати пацієнта по ID
- `POST /patients` - створити нового пацієнта
- `PUT /patients/:id` - оновити пацієнта
- `PATCH /patients/:id` - частково оновити пацієнта
- `DELETE /patients/:id` - видалити пацієнта

### **Медичні карти (Medcards)**

- `GET /medcards` - отримати список медкарт
- `GET /medcards/:id` - отримати медкарту по ID (з даними пацієнта)
- `POST /medcards` - створити нову медкарту
- `PUT /medcards/:id` - оновити медкарту
- `PATCH /medcards/:id` - частково оновити медкарту  
- `DELETE /medcards/:id` - видалити медкарту

### **Лікарі (Doctors)**

- `GET /doctors` - отримати список лікарів
- `GET /doctors/:id` - отримати лікаря по ID
- `POST /doctors` - створити нового лікаря
- `PUT /doctors/:id` - оновити лікаря
- `PATCH /doctors/:id` - частково оновити лікаря
- `DELETE /doctors/:id` - видалити лікаря

### **Аутентифікація (Auth)**

- `POST /login` - вхід в систему
- `POST /register` - реєстрація
- `POST /change-password` - зміна пароля

## **📸 Скріншоти з Postman**
### Отримання списку лікарів
![Отримання списку лікарів](image/3.jpg)
### Створення мед картки
![Створення мед картки](image/4.jpg) 
### Отримання списку медкарт
![Отримання списку медкарт](image/5.jpg)
### Видалення медкарти
![Видалення медкарти](image/6.jpg)
### Перевірка
![Перевірка](image/7.jpg)
### Створення пацієнта
![Створення пацієнта](image/8.jpg)

## 🏗 Архітектура додатку

### **Шари архітектури:**

#### 1. **Middleware (Валідація)**
- Перевірка вхідних даних
- Валідація запитів
- Обробка помилок

#### 2. **Controller (Оркестрація)**
- Обробка HTTP запитів
- Виклик сервісів
- Формування відповіді

#### 3. **Service (Бізнес-логіка)**
- Бізнес-правила
- Обробка даних
- Взаємодія з репозиторіями

#### 4. **Repository (Доступ до даних)**
- Робота з базою даних
- CRUD операції
- ORM взаємодія

### **Приклад Middleware-функції:**

```typescript
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorPatientCreate = (req: Request, res: Response, next: NextFunction) => {
  let { patient_fullname, patient_sex, patient_birthdaydate } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  patient_fullname = !patient_fullname ? '' : patient_fullname.toString().trim();
  patient_sex = !patient_sex ? '' : patient_sex.toString().trim();
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

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Create patient validation error', null, null, errorsValidation);
    return next(customError);
  }
  
  return next();
};
```
### **Приклад ResponseDTO:**

```typescript
import { Medcard } from 'orm/entities/medcard/Medcard';
import { Patient } from 'orm/entities/patient/Patient';

class PatientShortDto {
    id: number;
    patient_fullname: string;
    patient_sex: string;
    patient_birthdaydate: Date;

    constructor(patient: Patient) {
        this.id = patient.id;
        this.patient_fullname = patient.patient_fullname;
        this.patient_sex = patient.patient_sex;
        this.patient_birthdaydate = patient.patient_birthdaydate;
    }
}

export class MedcardResponseDto {
    id: number;
    patient_id: number;
    medcard_chronic: string;
    medcard_createdate: Date;
    medcard_bloodtype: string;
    patient?: PatientShortDto;

    constructor(medcard: Medcard) {
        this.id = medcard.id;
        this.patient_id = medcard.patient_id;
        this.medcard_chronic = medcard.medcard_chronic;
        this.medcard_createdate = medcard.medcard_createdate;
        this.medcard_bloodtype = medcard.medcard_bloodtype;
        
        if (medcard.patient) {
            this.patient = new PatientShortDto(medcard.patient);
        }
    }
}
```
### **Приклад Service-класу:**

```typescript
import { getRepository, Repository } from 'typeorm';
import { Medcard } from 'orm/entities/medcard/Medcard';
import { CustomError } from 'utils/response/custom-error/CustomError';

export class MedcardService {
    private medcardRepository: Repository<Medcard>;

    constructor() {
        this.medcardRepository = getRepository(Medcard);
    }

    async findById(id: number): Promise<Medcard> {
        const medcard = await this.medcardRepository.findOne({
            where: { id },
            relations: ['patient']
        });

        if (!medcard) {
            throw new CustomError(404, 'General', `Medcard with id:${id} not found.`);
        }

        return medcard;
    }

    async create(medcardData: Partial<Medcard>): Promise<Medcard> {
        const medcard = this.medcardRepository.create(medcardData);
        return await this.medcardRepository.save(medcard);
    }

    async list(): Promise<Medcard[]> {
        return await this.medcardRepository.find({
            relations: ['patient']
        });
    }
}
```
## **📸 Скріншоти з Postman**
