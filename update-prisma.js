const fs = require('fs');
const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
if (!schema.includes('directUrl')) {
  fs.writeFileSync('prisma/schema.prisma', schema.replace('url      = env("DATABASE_URL")', 'url      = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")'));
}
