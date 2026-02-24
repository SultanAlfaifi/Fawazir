import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create Main Admin
  const adminPassword = await hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@fawazir.com' },
    update: {},
    create: {
      email: 'admin@fawazir.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      displayName: 'المدير العام',
      bio: 'مشرف المنصة الأول',
      emailVerified: new Date()
    }
  })

  // Create Sample Player
  const playerPassword = await hash('player123', 10)

  await prisma.user.upsert({
    where: { email: 'player@fawazir.com' },
    update: {},
    create: {
      email: 'player@fawazir.com',
      passwordHash: playerPassword,
      role: 'PLAYER',
      displayName: 'المتسابق الأول',
      bio: 'محب للتحديات',
      avatar: 'rocket',
      color: 'indigo',
      emailVerified: new Date()
    }
  })

  // Create Sample Competition (Owned by Admin)
  // Code must be 8 digits unique
  const demoComp = await prisma.competition.create({
    data: {
      code: '12345678',
      title: 'مسابقة فوازير التجريبية',
      description: 'مسابقة تجريبية لاستعراض مميزات المنصة الجديدة.',
      ownerId: admin.id,
      status: 'ACTIVE',
      days: {
        create: [
          {
            dayNumber: 1,
            title: 'اليوم الأول: البداية',
            content: 'مرحباً بك في أول تحدي! هل أنت مستعد؟',
            isManualOpen: true,
            questions: {
              create: [
                {
                  text: 'ما هو الشيء الذي كلما أخذت منه كبر؟',
                  type: 'TEXT',
                  correctAnswer: 'الحفرة',
                  points: 10
                }
              ]
            }
          },
          {
            dayNumber: 2,
            title: 'اليوم الثاني: السرعة',
            content: 'تحدي السرعة والبديهة.',
            isManualOpen: false,
            questions: {
              create: [
                {
                  text: 'أسرع كائن بحري هو؟',
                  type: 'CHOICE',
                  options: ['القرش', 'الدلفين', 'أسماك الزينة'],
                  correctAnswer: 'القرش', // Just example
                  points: 15
                }
              ]
            }
          }
        ]
      }
    }
  })

  console.log('Seed completed!')
  console.log('Admin: admin@fawazir.com / admin123')
  console.log('Player: player@fawazir.com / player123')
  console.log('Comp Code: 12345678')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
