import prisma from './src/config/database';
async function test() {
    const result = await prisma.result.findUnique({
        where: { id: 'cmn9ya0m80001ksxwr8pbhai0' },
        include: { answers: true }
    });
    console.log('Result totalScore:', result?.totalScore);
    console.log('Result grammarTotal:', result?.grammarTotal);
    console.log('Result answers length:', result?.answers.length);
}
test().then(() => process.exit(0));
