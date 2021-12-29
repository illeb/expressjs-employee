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
    nullable: true
  })
  public birthDate?: Date;

  @Column({
    nullable: true
  })
  public hireDate?: Date;

}

@EntityRepository(Employee)
export class EmployeeRepository extends Repository<Employee> {
  findByName(firstName: string, lastName: string) {
    return this.createQueryBuilder("employee")
      .where('employee.firstName = :firstName', { firstName })
      .andWhere('user.lastName = :lastName', {lastName})
      .getMany();
  }
}