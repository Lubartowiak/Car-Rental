import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 30, unique: true })
  email: string;
  @Column({ length: 30 })
  username: string;
  @Column({ length: 512 })
  password: string;
}
