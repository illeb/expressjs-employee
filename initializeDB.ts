import { createConnection, getCustomRepository } from 'typeorm';
import { Employee, EmployeeRepository } from './src/data'

const employees = [
  new Employee(1, 'Tiziano', 'Qualunquelli'),
  new Employee(2, 'Pinco', 'Pallini'),
  new Employee(3, 'Caio', 'Semproni', new Date(1993, 1, 29), new Date(2021, 12, 30)),
  new Employee(4, 'Tal Dei', 'Tali', new Date(1995, 7, 21)),
]
console.log('DB INITIALIZED WITH MOCK DATA');
createConnection().then(() => {
  const repository = getCustomRepository(EmployeeRepository);
  repository.save(employees);
});