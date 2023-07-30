// data-access/models/schedule.model.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  Default,
} from "sequelize-typescript";
import UserModel from "./user.model";

export enum ScheduleStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

@Table({ timestamps: true })
class ScheduleModel extends Model<ScheduleModel> {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: false })
  scheduleId!: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  empId!: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  scheduledDate!: Date;

  @Column(DataType.INTEGER)
  scheduledCollection?: number;

  @Column(DataType.INTEGER)
  scheduledHrs?: number;

  @Column(DataType.STRING)
  assignedCustomers?: string;

  @Default(ScheduleStatus.Pending)
  @Column({
    type: DataType.ENUM,
    values: Object.values(ScheduleStatus),
    allowNull: false,
  })
  status!: ScheduleStatus;
}

export default ScheduleModel;
