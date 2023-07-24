import User from "../domain/User";
import RegistrationRequestModel, {
  RegistrationStatus,
} from "./models/registrationRequest.model";

const saveRegistrationRequest = async function (user: User) {
  // do a db query save user object.
  const userModel = new RegistrationRequestModel({
    ...user,
    registrationStatus: RegistrationStatus.Pending,
  });
  return await userModel.save();
};

export { saveRegistrationRequest };
