// data-access/models/target.model.ts
import { Model, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import UserModel from "./user.model";

@Table({ timestamps: true })
class TargetModel extends Model {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: false })
  targetId!: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  empId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  collectedAmount!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  scheduledAmount!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  targetCoveragePercentage!: number;
}

export default TargetModel;
