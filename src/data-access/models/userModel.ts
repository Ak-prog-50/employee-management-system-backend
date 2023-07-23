import {
  Model,
  DataType,
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from "sequelize-typescript";
import { TRole } from "../../types/generalTypes";
import { IUserParams } from "../../domain/User";

@Table
class UserModel extends Model implements IUserParams {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  empId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contactNo!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column(DataType.INTEGER)
  age!: number;

  @Column(DataType.STRING)
  designation!: string;

  @Column(DataType.STRING)
  address!: string;

  @Column(DataType.DATE)
  dob!: Date;

  @Column(DataType.DATE)
  appDate!: Date;

  @Column(DataType.STRING)
  role!: TRole;

  @CreatedAt
  creationDate!: Date;

  @UpdatedAt
  updatedOn!: Date;

  @DeletedAt
  deletionDate!: Date;
}

export default UserModel;
