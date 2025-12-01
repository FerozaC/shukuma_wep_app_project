import jwt from "jsonwebtoken"

export const generateToken = (id: string) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || "30d"
  // jsonwebtoken@9 types expect a branded StringValue/number; runtime accepts strings like "7d".
  // Cast options to satisfy TypeScript while keeping synchronous sign.
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "secret",
    { expiresIn } as unknown as jwt.SignOptions
  )
}
