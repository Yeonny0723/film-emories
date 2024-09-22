import { getIronSession } from 'iron-session';

import { cookies } from 'next/headers'; // 사용자를 구분할 기억하는 쿠키

// 세션에 저장할 데이터 형태 정의
interface SessionContent {
  id?: number;
}

// 쿠키에 저장된 세션 데이터 가져오기
export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: 'mis-cookie',
    password: process.env.COOKIE_PASSWORD!,
  });
}
