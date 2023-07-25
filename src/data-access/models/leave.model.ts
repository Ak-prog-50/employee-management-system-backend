import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from "sequelize-typescript";
import UserModel from "./user.model";

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
    type: DataType.STRING,
    allowNull: false,
  })
  leaveType!: string;
}

export default LeaveModel;
