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

// todo: seperate tables for employee, manager and hrPerson
@Table
class UserModel extends Model {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  protectedPassword!: string;

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

  get age(): number {
    const currentDate = new Date();
    const birthDate = new Date(this.dob);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const birthMonth = birthDate.getMonth();
    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
}

export default UserModel;
