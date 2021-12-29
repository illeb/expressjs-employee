import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from 'typeorm';

@Entity()
export class Employee {
  
  @PrimaryGeneratedColumn()
  private id = -1;
  
  @Column()
  private firstName: string;

  @Column()
  private lastName: string;

  @Column({
    nullable: true
  })
  private birthDate?: Date;

  @Column({
    nullable: true
  })
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