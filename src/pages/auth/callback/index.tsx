import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Alert, Button } from 'antd';

import { authCode } from '@/services/auth';
import { setToken } from '@/utils/token';
import styles from './style.less';

interface CallbackProps {
  location: any;
}

const CallbackMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const errors = {
  invalid_request: '无效的请求',
  unauthorized_client: '未经授权的客户端',
  access_denied: '拒绝访问',
  unsupported_response_type: '不支持的response类型',
  unsupported_grant_type: '不支持的grant类型',
  invalid_grant: '无效的grant',
  invalid_scope: '无效scope',
  temporarily_unavailable: '暂时不可用',
  server_error: '服务器错误',
  invalid_client: '无效的客户',
  invalid_access_token: '无效的访问令牌',
  invalid_redirect_uri: '无效的RedirectURI',
};
const formatErrorMessage = (code: string) => errors[code] || code;

const Callback: React.FC<CallbackProps> = (props) => {
  const { location } = props;
  const [error, setError] = useState<string>();
  useEffect(() => {
    if (location.query.code) {
      authCode({ code: location.query.code }).then(({ status, data, error: errorMsg }) => {
        if (status === 'ok') {
          setError('ok');
          setToken(data);
          if (location.query.redirect) {
            window.location.href = location.query.redirect;
          } else {
            history.replace('/');
          }
        } else {
          setError(formatErrorMessage(errorMsg));
        }
      });
    } else if (location.query.error) {
      setError(formatErrorMessage(location.query.error));
    }
  }, []);

  const reloging = () => {
    const OAUTH2_LOGIN = `${OAUTH2_SERVER}/oauth2/authorize?client_id=${OAUTH2_CLIENT_ID}&redirect_uri=${encodeURI(
      OAUTH2_CALLBACK,
    )}&response_type=code&state=somestate&scope=openid profile email phone`;
    window.location.href = OAUTH2_LOGIN;
  };

  return (
    <div className={styles.main}>
      <div className={styles.message}>
        {error === 'logout' ? (
          <>
            <Alert
              style={{
                marginBottom: 24,
              }}
              message="退出登录成功"
              type="warning"
              showIcon
            />
            <Button
              type="primary"
              onClick={reloging}
              style={{
                margin: '0 auto',
                display: 'block',
              }}
            >
              重新登录
            </Button>
          </>
        ) : null}
        {error === 'ok' ? (
          <Alert
            style={{
              marginBottom: 24,
            }}
            message="登录成功"
            type="success"
            showIcon
          />
        ) : null}
        {error && error !== 'logout' && error !== 'ok' ? (
          <>
            <CallbackMessage content={error} />
            <Button
              type="primary"
              onClick={reloging}
              style={{
                margin: '0 auto',
                display: 'block',
              }}
            >
              重新登录
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Callback;
