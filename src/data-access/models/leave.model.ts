import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from "sequelize-typescript";
import UserModel from "./user.model";
import { LeaveStatus, LeaveType } from "../../domain/Leave";

@Table
class LeaveModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  leaveId!: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  empId!: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(LeaveType),
    allowNull: false,
  })
  leaveType!: LeaveType;

  @Column({
    type: DataType.ENUM,
    values: Object.values(LeaveStatus),
    allowNull: false,
  })
  status!: LeaveStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate!: Date;
}

export default LeaveModel;
