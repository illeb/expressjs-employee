import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  public id = -1;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column({
    nullable: true,
  })
  public birthDate?: Date;

  @Column({
    nullable: true,
  })
  public hireDate?: Date;

  constructor(id: number, firstName: string, lastName: string, birthDate?: Date, hireDate?: Date) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.hireDate = hireDate;
  }
}

@EntityRepository(Employee)
export class EmployeeRepository extends Repository<Employee> {
  findByName(firstName: string, lastName: string) {
    const loweredFirstName = firstName.toLowerCase();
    const loweredLastName = lastName.toLowerCase();

    return this.createQueryBuilder('employee')
      .where('LOWER(employee.firstName) = :loweredFirstName', { loweredFirstName })
      .andWhere('LOWER(employee.lastName) = :loweredLastName', { loweredLastName })
      .getMany();
  }
}
