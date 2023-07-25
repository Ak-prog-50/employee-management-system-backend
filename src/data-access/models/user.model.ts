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

const ENTITLED_LEAVES = 30;
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

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  entitLeaves: number = ENTITLED_LEAVES;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  takenLeaves: number = 0;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  casualLeavesBalance: number = 7;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sickLeavesBalance: number = 7;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  annualLeavesBalance: number = 14;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  dutyLeavesBalance: number = 2;

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
