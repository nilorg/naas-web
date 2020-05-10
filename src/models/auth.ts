import { stringify } from 'querystring';
import { history, Effect, Reducer } from 'umi';

import { authCode } from '@/services/auth';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { setToken, removeToken } from '@/utils/token';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface AuthModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: AuthModelType = {
  namespace: 'auth',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(authCode, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if (response && response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },
    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/auth/callback' && !redirect) {
        removeToken();
        history.replace({
          pathname: '/auth/callback',
          search: stringify({
            error: 'logout',
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload) {
        if (payload.status === 'ok') {
          setAuthority(payload.currentAuthority);
          setToken(payload.data);
        }
        console.log('result:', payload);
        return {
          ...state,
          // status: payload.status,
          status: 'error',
        };
      }
      console.log('result22222222:', state);
      return {
        ...state,
      };
    },
  },
};

export default Model;
