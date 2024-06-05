import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Car } from "./car.entity";
import { Status } from "./enums/Status";

@Entity({ name: "rentings" })
export class Renting {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Car, (car) => car.rentings, { onDelete: "CASCADE" })
  car: Car;
  @Column("date")
  startDate: Date;
  @Column("date")
  endDate: Date;
  @Column({ type: "enum", enum: Status, default: Status.Active })
  status: Status;
}
