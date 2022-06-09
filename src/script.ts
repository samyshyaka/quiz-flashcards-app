import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const newQuiz = await prisma.card.create({
        data: {
            category: 'Programming',
            question: 'What is TypeScript?',
            answer: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript'                        
        }
    })
    const allCards = await prisma.card.findMany();
    console.log(allCards);    
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect
    })