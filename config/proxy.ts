// import { OAUTH2_SERVER } from '../src/utils/constants';
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/auth/': {
      target: 'http://localhost:8081',
      changeOrigin: true,
      pathRewrite: {
        '^/api/': '',
      },
      secure: false,
    },
    '/api/accounts/': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api/accounts/': '',
      },
      secure: false,
    },
    '/api/': {
      target: 'http://localhost:8080/api/v1',
      changeOrigin: true,
      pathRewrite: {
        '^/api/': '',
      },
      secure: false,
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/auth/': {
      target: 'http://naas-admin-token-server.nilorg:8081',
      changeOrigin: true,
      pathRewrite: {
        '^/api/': '',
      },
      secure: false,
    },
    '/api/accounts/': {
      target: 'http://naas.nilorg:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api/accounts/': '',
      },
      secure: false,
    },
    '/api/': {
      target: 'http://naas.nilorg:8080/api/v1',
      changeOrigin: true,
      pathRewrite: {
        '^/api/': '',
      },
      secure: false,
    },
  },
};
