## Error Type
Runtime TypeError

## Error Message
Cannot read properties of undefined (reading 'findMany')


    at getDayDetails (src\actions\days.ts:53:37)
    at  DayPage (src\app\app\day\[id]\page.tsx:34:17)
    at resolveErrorDev (file://C:/Users/SULTAN1/OneDrive - Umm Al-Qura University/سطح المكتب/Fawazir/Fawazir Web/.next/dev/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_9212ccad._.js:1894:148)
    at processFullStringRow (file://C:/Users/SULTAN1/OneDrive - Umm Al-Qura University/سطح المكتب/Fawazir/Fawazir Web/.next/dev/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_9212ccad._.js:2402:29)
    at processFullBinaryRow (file://C:/Users/SULTAN1/OneDrive - Umm Al-Qura University/سطح المكتب/Fawazir/Fawazir Web/.next/dev/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_9212ccad._.js:2361:9)
    at processBinaryChunk (file://C:/Users/SULTAN1/OneDrive - Umm Al-Qura University/سطح المكتب/Fawazir/Fawazir Web/.next/dev/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_9212ccad._.js:2470:221)
    at progress (file://C:/Users/SULTAN1/OneDrive - Umm Al-Qura University/سطح المكتب/Fawazir/Fawazir Web/.next/dev/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_9212ccad._.js:2640:13)

## Code Frame
  51 |
  52 |     // جلب مهام اللاعب لهذا اليوم
> 53 |     const tasks = await prisma.task.findMany({
     |                                     ^
  54 |         where: { userId: session.userId, dayId: day.id },
  55 |         orderBy: { createdAt: 'asc' }
  56 |     })

Next.js version: 16.1.6 (Turbopack)
