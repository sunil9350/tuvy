import bcrypt from "bcryptjs";

const pwd = process.argv[2];
if (!pwd) {
  console.error('Usage: npx tsx scripts/hash-admin-password.ts "your-password"');
  process.exit(1);
}

console.log(bcrypt.hashSync(pwd, 12));
