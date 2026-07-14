import { PrismaClient, Roles } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Siembra los roles base que la app necesita para funcionar.
 * Sin estas filas, el registro de usuarios falla ("Rol ... no encontrado"),
 * porque createUser busca el rol por nombre.
 *
 * Es idempotente (upsert): se puede correr varias veces sin duplicar nada.
 */
async function main() {
  const roles: Roles[] = [Roles.Tester, Roles.Administrator];

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(`✔ Roles sembrados: ${roles.join(', ')}`);
}

main()
  .catch((error) => {
    console.error('Error sembrando roles:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
