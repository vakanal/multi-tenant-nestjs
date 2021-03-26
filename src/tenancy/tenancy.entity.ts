import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tenancies')
export class TenancyEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;
}
