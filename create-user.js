const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log('Usage: node create-user.js <email> <password> [name]');
        console.log('Example: node create-user.js teste@email.com 123456 "Usuario Teste"');
        process.exit(1);
    }

    const email = args[0];
    const password = args[1];
    const name = args[2] || 'Usuário';

    try {
        // Check if user exists
        const existing = await prisma.user.findUnique({
            where: { email }
        });

        if (existing) {
            console.log(`❌ User with email ${email} already exists.`);
            process.exit(1);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        console.log(`✅ User created successfully!`);
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Name: ${user.name}`);

    } catch (error) {
        console.error('❌ Error creating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
