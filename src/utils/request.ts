/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { getToken } from './token';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};
// 前缀匹配
const whiteUrl = ['/auth/token'];
const requestHandler = (url: any, options: any) => {
  const token = getToken();
  if (whiteUrl.findIndex((i) => url.startsWith(i)) === -1 && token) {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token.access_token}`,
    };
    return {
      url,
      options: { ...options, headers },
    };
  }
  return {
    url,
    options,
  };
};
/**
 * 配置gatewayRequest请求时的默认参数
 */
const gatewayRequest = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  prefix: '/gateway',
  headers: {
    'X-NilorgApiGateway-Client': 'Nilorg-Crontab-Web',
    'X-NilorgApiGateway-ClientVersion': 'v1',
  },
});
gatewayRequest.interceptors.request.use(requestHandler);
export { gatewayRequest };

// /**
//  * 配置oauth2Request请求时的默认参数
//  */
// const oauth2Request = extend({
//   errorHandler, // 默认错误处理
//   credentials: 'include', // 默认请求是否带上cookie
//   prefix: '/oauth2',
// });
// oauth2Request.interceptors.request.use(requestHandler);
// export { oauth2Request };
/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  prefix: '/api',
});
request.interceptors.request.use(requestHandler);

// let retryCount = 0;
// async function retryRequest(response: Response, options: RequestOptionsInit) {
//   retryCount += 1;
//   const oldToken = getToken();
//   if (oldToken && retryCount <= 3) {
//     // TODO: 接口开发完毕后对接
//     const newToken = await request.get(`/web/token/refresh/${oldToken.refresh_token}`);
//     if (newToken) {
//       setToken(newToken.data);
//       retryCount = 0;
//       // 设置Token成功后，重新执行请求
//       return request(response.url, { ...options, prefix: undefined, params: undefined });
//     }
//   }
//   // 获取原来Token失败
//   notification.error({
//     description: '您的Token发生异常，无法找到Token',
//     message: 'Token错误',
//   });
//   retryCount = 0;
//   // 获取Token失败，去登录页面
//   window.location.href = '/user/login';
//   return response;
// }

// // response拦截器, 处理response
// request.interceptors.response.use(async (response, options) => {
//   // const { status } = response;
//   // if (status === 401) {
//   //   return retryRequest(response, options);
//   // }
//   // 克隆响应对象做解析处理
//   const data = await response.clone().json();
//   // 认证失败
//   // if (data.code === 1000) {
//   //   return retryRequest(response, options);
//   // }
//   // 刷新Token失败
//   if (data.code === 1005) {
//     window.location.href = '/user/login';
//     return response;
//   }
//   if (data.code === 2000) {
//     notification.error({
//       description: '您的权限不足，无法执行操作',
//       message: '权限错误',
//     });
//   } else if (data.code === 9000) {
//     notification.error({
//       description: '系统发生异常，请稍候重试',
//       message: '系统错误',
//     });
//   }
//   return response;
// });

export default request;
