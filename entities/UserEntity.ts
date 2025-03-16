import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({
    length: 100,
  })
  first_name: string;

  @Column({
    length: 100,
  })
  last_name: string;
}
