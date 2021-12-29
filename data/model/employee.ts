import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from 'typeorm';

@Entity()
export class Employee {
  
  @PrimaryGeneratedColumn()
  private id = -1;
  
  @Column()
  private firstName = '';

  @Column()
  private lastName = '';

  @Column()
  private birthDate?: Date;

  @Column()
  private hireDate?: Date;

}

@EntityRepository()
export class EmployeeRepository extends Repository<Employee> {
  findByName(firstName: string, lastName: string) {
    return this.createQueryBuilder("employee")
      .where('employee.firstName = :firstName', { firstName })
      .andWhere('user.lastName = :lastName', {lastName})
      .getMany();
  }
}