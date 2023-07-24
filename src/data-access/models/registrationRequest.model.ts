import {
  Model,
  DataType,
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Default,
} from "sequelize-typescript";
import { TRole } from "../../types/generalTypes";

export enum RegistrationStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

@Table
class RegistrationRequestModel extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

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

  @Column({
    type: DataType.ENUM,
    values: Object.values(RegistrationStatus),
    defaultValue: RegistrationStatus.Pending,
  })
  registrationStatus!: RegistrationStatus;

  @CreatedAt
  creationDate!: Date;

  @UpdatedAt
  updatedOn!: Date;

  @DeletedAt
  deletionDate!: Date;
}

export default RegistrationRequestModel;
