// models/Timesheet.ts
import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  Default,
} from "sequelize-typescript";
import UserModel from "./user.model";

export enum TimesheetStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

// todo: add camelcase for column names
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

  @Default(TimesheetStatus.Pending)
  @Column({
    type: DataType.ENUM,
    values: Object.values(TimesheetStatus),
    allowNull: false,
  })
  status!: TimesheetStatus;
}

export default TimesheetModel;
