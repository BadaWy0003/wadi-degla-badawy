const AdminService = {};

const hashPassword = require('../utils/password-hasher');
const Admin = require('../models/Admin');

AdminService.createAdmin = async (adminData) => {
  const { username, email, password } = adminData;

  const adminExist = await Admin.findOne({ email });

  if (adminExist) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const newAdmin = new Admin({
    username,
    email,
    password: hashedPassword,
  });

  await newAdmin.save();
  newAdmin.password = undefined;

  return { newAdmin };
};

AdminService.deleteAdmin = async (adminId) => {
  const adminExist = await Admin.findById(adminId);

  if (!adminExist) {
    return { error: "User Doesn't Exist" };
  }

  const deletedAdmin = await Admin.findByIdAndDelete(adminId);

  return deletedAdmin;
};

AdminService.getAdminByIdAndExcludePassword = async (adminId) => {
  return Admin.findById(adminId).select('-password');
};

AdminService.getAdminById = async (adminId) => {
  return Admin.findById(adminId);
};

AdminService.fetchAllAdmin = async () => {
  const respond = await Admin.find();
  return respond;
};

AdminService.currentAdminUpdate = async (adminId, newAdmin) => {
  const adminExist = await Admin.findById(adminId);

  if (!adminExist) {
    return { error: "User Doesn't Exist" };
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(adminId, { username: newAdmin.username }, { new: true });

  return updatedAdmin;
};

module.exports = AdminService;
