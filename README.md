# Документація сутностей та API

##  Реалізовані сутності

### Doctor
- **Таблиця:** `doctor`
- **Поля:**
  - `id` — первинний ключ
  - `specialty_id` — зовнішній ключ → `specialty.id`
  - `doctor_fullname` — ПІБ лікаря (унікальне, max 40 символів)
  - `doctor_number` — код лікаря (унікальне, max 10 символів, nullable)
  - `doctor_office` — номер кабінету (1–999, перевірка через `@Check`)
  - `doctor_workschedule` — графік роботи (nullable, max 100 символів)
- **Зв’язки:**
  - `ManyToOne` → `Specialty`

---

### Medcard
- **Таблиця:** `medcard`
- **Поля:**
  - `id` — первинний ключ
  - `patient_id` — зовнішній ключ → `patient.id`
  - `medcard_chronic` — хронічні захворювання (nullable, max 50 символів)
  - `medcard_createdate` — дата створення картки
  - `medcard_bloodtype` — група крові (varchar(3), default: `O-`)
  - `created_at`, `updated_at` — системні дати
- **Зв’язки:**
  - `ManyToOne` → `Patient` (каскадне видалення/оновлення)

---

### Patient
- **Таблиця:** `patient`
- **Поля:**
  - `id` — первинний ключ
  - `patient_fullname` — ПІБ пацієнта (унікальне, max 40 символів)
  - `patient_sex` — стать (varchar(10), default: `other`)
  - `patient_address` — адреса (nullable, max 30 символів)
  - `patient_registerdate` — дата реєстрації
  - `patient_number` — номер пацієнта (унікальне, nullable, max 20 символів)
  - `patient_birthdaydate` — дата народження
  - `created_at`, `updated_at` — системні дати
- **Зв’язки:**
  - `OneToMany` → `Medcard`

---

### Specialty
- **Таблиця:** `specialty`
- **Поля:**
  - `id` — первинний ключ
  - `specialty_name` — назва спеціальності (varchar(30))
  - `specialty_salary` — зарплата (numeric, 8000–25000, перевірка через `@Check`)
- **Зв’язки:**
  - `OneToMany` → `Doctor`

---

##  Зв’язки між сутностями
- **Doctor → Specialty**: багато лікарів належать до однієї спеціальності.
- **Medcard → Patient**: багато медкарт належать одному пацієнту.
- **Patient → Medcard**: пацієнт має список медкарт.
- **Doctor → Medcard**: лікар може бути прив’язаний до медкарти (через `doctor_id`, якщо додати).

---

##  Реалізовані API ендпоінти

### Doctor API
- `GET /doctor` — отримати список лікарів
- `GET /doctor/{id}` — отримати лікаря за ID
- `POST /doctor` — створити лікаря
- `PUT /doctor/{id}` — оновити дані лікаря
- `DELETE /doctor/{id}` — видалити лікаря

### Patient API
- `GET /patient` — отримати список пацієнтів
- `GET /patient/{id}` — отримати пацієнта за ID
- `POST /patient` — створити пацієнта
- `PUT /patient/{id}` — оновити дані пацієнта
- `DELETE /patient/{id}` — видалити пацієнта

### Medcard API
- `GET /medcard` — отримати список медкарт
- `GET /medcard/{id}` — отримати медкарту за ID
- `POST /medcard` — створити медкарту
- `PUT /medcard/{id}` — оновити медкарту
- `DELETE /medcard/{id}` — видалити медкарту

### Specialty API
- `GET /specialty` — отримати список спеціальностей
- `GET /specialty/{id}` — отримати спеціальність за ID
- `POST /specialty` — створити спеціальність
- `PUT /specialty/{id}` — оновити спеціальність
- `DELETE /specialty/{id}` — видалити 
