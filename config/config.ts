// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/auth',
      component: '../layouts/AuthLayout',
      routes: [
        {
          name: '授权回调',
          path: '/auth/callback',
          component: './auth/callback',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/dashboard',
            },
            {
              path: '/dashboard',
              name: 'Dashboard',
              icon: 'DashboardOutlined',
              component: './Dashboard',
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/sub-page',
                  name: 'sub-page',
                  icon: 'smile',
                  component: './Dashboard',
                  authority: ['admin'],
                },
              ],
            },
            {
              name: '基础数据',
              icon: 'LockOutlined',
              path: '/basic',
              routes: [
                {
                  name: '组织',
                  icon: 'ShopOutlined',
                  path: '/basic/organization',
                  component: './basic/organization/index',
                },
                {
                  name: '用户',
                  icon: 'UserOutlined',
                  path: '/basic/users',
                  component: './basic/user/index',
                },
              ],
            },
            {
              name: 'OAuth2',
              icon: 'IdcardOutlined',
              path: '/oauth2',
              routes: [
                {
                  name: '客户端',
                  icon: 'DesktopOutlined',
                  path: '/oauth2/clients',
                  component: './oauth2/client/index',
                },
                {
                  name: '范围',
                  icon: 'EllipsisOutlined',
                  path: '/oauth2/scopes',
                  component: './oauth2/scope/index',
                },
              ],
            },
            {
              name: 'Casbin',
              icon: 'LockOutlined',
              path: '/casbin',
              routes: [
                {
                  name: '租户',
                  icon: 'ShopOutlined',
                  path: '/casbin/tenants',
                  component: './casbin/tenant/index',
                },
                {
                  name: '角色',
                  icon: 'TeamOutlined',
                  path: '/casbin/roles',
                  component: './casbin/role/index',
                },
                {
                  name: '访问策略',
                  icon: 'ShareAltOutlined',
                  path: '/casbin/policys',
                  component: './casbin/policy/index',
                },
              ],
            },
            {
              name: '资源',
              icon: 'HddOutlined',
              path: '/resource',
              routes: [
                {
                  name: '路由',
                  icon: 'LinkOutlined',
                  path: '/resource/routes',
                  component: './resource/route/index',
                },
                {
                  name: '菜单',
                  icon: 'table',
                  path: '/resource/menus',
                  component: './resource/menu/index',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
