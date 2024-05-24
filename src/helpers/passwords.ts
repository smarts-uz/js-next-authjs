import bcrypt from 'bcryptjs'

export const matchPasswords = async (
  password: string,
  hashedPassword: string | null | undefined
) => {
  return await bcrypt.compare(password, <string>hashedPassword)
}
