// models/Timesheet.ts
import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import UserModel from "./user.model";

@Table({ timestamps: true })
class TimesheetModel extends Model<TimesheetModel> {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: false })
  timesheet_id!: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  emp_id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  week!: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  worked_date!: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  hrs!: number;

  @Column(DataType.STRING)
  remarks?: string;

  @Column(DataType.INTEGER)
  collectedAmount?: number;
}

export default TimesheetModel;
