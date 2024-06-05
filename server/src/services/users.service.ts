import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import bcrypt from "bcrypt";

const checkUserExists = async (email: string) => {
  const usersRepository = AppDataSource.getRepository<User>("User");
  const user = await usersRepository.exists({
    where: { email: email },
  });
  return user;
};

const findUserByEmail = async (email: string) => {
  const usersRepository = AppDataSource.getRepository<User>("User");
  return await usersRepository.findOneBy({ email: email });
};

const addNewUser = async (
  username: string,
  email: string,
  password: string
) => {
  const usersRepository = AppDataSource.getRepository<User>("User");
  const hashedPassword = await bcrypt.hash(password, 10);
  let user = new User();
  user.email = email;
  user.password = hashedPassword;
  user.username = username;
  usersRepository.save(user);
};

const checkPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export { checkUserExists, addNewUser, checkPassword, findUserByEmail };
