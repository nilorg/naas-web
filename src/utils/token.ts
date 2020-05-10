import moment from 'moment';

export interface TokenData {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  expires?: string;
  expired: boolean;
  scope: string;
}
const TOKEN_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const TOKEN_KEY = 'union-token';
// 设置Token
export function setToken(token: any): void {
  const saveToken: TokenData = {
    ...token,
    expired: false,
    expires: moment.unix(token.expires_in).format(TOKEN_TIME_FORMAT),
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(saveToken));
}
// 删除Token
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
// 获取Token
export function getToken(): TokenData | null {
  const tokenValue = localStorage.getItem(TOKEN_KEY);
  if (tokenValue) {
    // 判断Token有没有过期
    const result = JSON.parse(tokenValue) as TokenData;
    if (!result.expires) {
      return null;
    }
    result.expired = moment(result.expires, TOKEN_TIME_FORMAT).isBefore(new Date());
    return result;
  }
  return null;
}
