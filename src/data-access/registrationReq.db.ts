import { UpdateOptions } from "sequelize";
import User from "../domain/User";
import RegistrationRequestModel, {
  RegistrationStatus,
} from "./models/registrationRequest.model";
import AppError from "../utils/error-handling/AppErrror";

const saveRegistrationRequest = async function (user: User) {
  // do a db query save user object.
  const userModel = new RegistrationRequestModel({
    ...user,
    registrationStatus: RegistrationStatus.Pending,
  });
  return await userModel.save();
};

/**
 * @returns false if no pending registration request is found, true if succesful operation or AppError
 */
const findAndApprove = async function (
  email: string,
): Promise<boolean | AppError> {
  try {
    const registrationRequest = await RegistrationRequestModel.findOne({
      where: {
        email,
        registrationStatus: "pending", // Only find pending registration requests
      },
    });

    if (!registrationRequest) {
      return false; // If no pending request is found, return false
    }

    // Update the registrationStatus to "approved"
    const updateOptions: UpdateOptions = {
      where: { id: registrationRequest.id },
      fields: ["registrationStatus"],
      returning: true,
    };

    await RegistrationRequestModel.update(
      { registrationStatus: "approved" },
      updateOptions,
    );

    return true;
  } catch (error) {
    // Handle any errors
    return AppError.internal(
      email,
      "Error finding and approving registration request",
    );
  }
};

export { saveRegistrationRequest, findAndApprove };
