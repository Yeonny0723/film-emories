// import { getUserPermissions } from '@/lib/auth';
// import getSession from '@/lib/session';

// import { NextRequest, NextResponse } from 'next/server';

// interface Routes {
//   [key: string]: string[]; // 권한 배열로 변경
// }

// const protectedUrls: Routes = {
//   '/admin': ['admin'], // 페이지별 접근 가능한 authCode
//   '/editor': ['admin', 'editor'],
// };

// export async function middleware(request: NextRequest) {
//   const session = await getSession();
//   //   TODO: 윈도우 인증 과정에서 req.headers['x-iisnode-auth_user'] 사용자 정보 추출 후 req.user 객체에 데이터 추가해주면 미들웨어에서 해당 세션 받아와 권한 처리하는 형식
//   //   모든 권한 처리는 이 방식으로 수정 요청! 왜냐하면 매번 Login 요청 후 메모리에 들고 있는 것 불필요하게 login이 호출돼
//   //   아얘 백엔드로 요청을 못보내도록 보안 처리 가능
//   if (session.id) {
//     const permissions = await getUserPermissions();
//     const requiredPermissions = protectedUrls[request.nextUrl.pathname];
//     if (requiredPermissions && !requiredPermissions.some((p) => permissions.includes(p))) {
//       return NextResponse.redirect(new URL('/403', request.url)); // 권한 없음 403 페이지
//     }
//   } else {
//     return NextResponse.redirect(new URL('/', request.url)); // 비로그인 홈으로 리다이렉트
//   }
// }

// export const config = {
//   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
// };
