// data-access/target.db.ts
import TargetModel from "./models/target.model";

class TargetDB {
  async createTarget(target: TargetModel): Promise<TargetModel> {
    try {
      const createdTarget = await target.save();
      return createdTarget;
    } catch (error) {
      console.error("Error creating target at db layer", error);
      // todo: handle error
      throw new Error("Failed to create target");
    }
  }

  async getTargetReportByEmpId(empId: number): Promise<TargetModel | null> {
    try {
      const target = await TargetModel.findOne({
        where: { empId },
      });
      return target;
    } catch (error) {
      console.error("Error fetching target report", error);
      // todo: handle error
      throw new Error("Failed to fetch target report");
    }
  }
}

export default TargetDB;
