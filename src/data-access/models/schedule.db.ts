// data-access/schedule.db.ts

import ScheduleModel from "./schedule.model";

class ScheduleDB {
  async createSchedule(schedule: ScheduleModel): Promise<ScheduleModel> {
    return await ScheduleModel.create(schedule);
  }

  async updateSchedule(schedule: ScheduleModel): Promise<ScheduleModel | null> {
    const existingSchedule = await ScheduleModel.findOne({
      where: { scheduleId: schedule.scheduleId },
    });

    if (!existingSchedule) {
      return null;
    }

    return await existingSchedule.update(schedule);
  }

  async getScheduleById(scheduleId: number): Promise<ScheduleModel | null> {
    return await ScheduleModel.findOne({ where: { scheduleId } });
  }

  async getSchedulesByEmpId(empId: number): Promise<ScheduleModel[]> {
    return await ScheduleModel.findAll({ where: { empId } });
  }
}

export default ScheduleDB;
