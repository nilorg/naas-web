import { Effect, Reducer } from 'umi';

import { queryCurrent, query as queryUsers } from '@/services/user';

export interface CurrentUser {
  sub?: string;
  name?: string;
  picture?: string;
  nickname?: string;
  gender?: number;
  email?: string;
  email_verified?: boolean;
  phone?: string;
  phone_verified?: boolean;
  // avatar?: string;
  // name?: string;
  // title?: string;
  // group?: string;
  // signature?: string;
  // tags?: {
  //   key: string;
  //   label: string;
  // }[];
  // userid?: string;
  // unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, { payload }) {
      const { err } = payload;
      if (!err) {
        return {
          ...state,
          currentUser:
            {
              ...payload,
            } || {},
        };
      }
      return {
        ...state,
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
