// data-access/models/schedule.model.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from "sequelize-typescript";
import UserModel from "./user.model";

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
}

export default ScheduleModel;
