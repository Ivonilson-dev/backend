const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const expenses = [
    'Alimentação', 'Transporte', 'Moradia', 'Educação', 'Saúde',
    'Lazer', 'Supermercado', 'Restaurantes', 'Vestuário', 'Eletrônicos',
    'Assinaturas', 'Presentes', 'Doações', 'Impostos', 'Seguros',
    'Manutenção Casa', 'Manutenção Carro', 'Combustível', 'Viagens', 'Outros'
];

const incomes = [
    'Salário', 'Freelance', 'Investimentos', 'Presentes', 'Vendas',
    'Reembolso', 'Aluguel', 'Dividendos', 'Bônus', '13º Salário',
    'Férias', 'Rescisão', 'Aposentadoria', 'Pensões', 'Prêmios',
    'Cashback', 'Consultoria', 'Aulas Particulares', 'Royalties', 'Outras Receitas'
];

async function main() {
    const args = process.argv.slice(2);
    const email = args[0];

    if (!email) {
        console.log('Usage: node seed-categories.js <user_email>');
        console.log('Example: node seed-categories.js ivonilsoncardoso@gmail.com');
        process.exit(1);
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.error(`❌ User with email ${email} not found.`);
            process.exit(1);
        }

        console.log(`Seeding categories for user: ${user.name} (${user.email})...`);

        // Create Expenses
        for (const name of expenses) {
            await prisma.category.upsert({
                where: {
                    userId_name_type: {
                        userId: user.id,
                        name,
                        type: 'EXPENSE'
                    }
                },
                update: {},
                create: {
                    userId: user.id,
                    name,
                    type: 'EXPENSE'
                }
            });
        }
        console.log('✅ Expenses created!');

        // Create Incomes
        for (const name of incomes) {
            await prisma.category.upsert({
                where: {
                    userId_name_type: {
                        userId: user.id,
                        name,
                        type: 'INCOME'
                    }
                },
                update: {},
                create: {
                    userId: user.id,
                    name,
                    type: 'INCOME'
                }
            });
        }
        console.log('✅ Incomes created!');

    } catch (error) {
        console.error('❌ Error seeding categories:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
