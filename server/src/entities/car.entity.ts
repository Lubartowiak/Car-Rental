import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FuelType } from "./enums/FuelType";
import { BodyType } from "./enums/BodyType";
import { Renting } from "./renting.entity";

@Entity({ name: "cars" })
export class Car {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 30 })
  manufacturer: string;
  @Column({ length: 30 })
  model: string;
  @Column({ type: "decimal", precision: 2, scale: 1 })
  volume: number;
  @Column({ length: 4 })
  year: string;
  @Column({ type: "enum", enum: FuelType })
  fuel: FuelType;
  @Column({ type: "enum", enum: BodyType })
  body: BodyType;
  @Column({ default: true })
  available: boolean;
  @OneToMany(() => Renting, (renting) => renting.car)
  rentings: Renting[];
}
