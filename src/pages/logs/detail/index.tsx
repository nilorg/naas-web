import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import { getJobLog } from './service';

const CodePreview: React.FC<{}> = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

interface DetailProps {
  location: any;
}

const Detail: React.FC<DetailProps> = ({ location }) => {
  const [detail, setDetail] = useState<any>({});
  useEffect(() => {
    if (location.query.id) {
      getJobLog({
        id: location.query.id,
      }).then((result) => {
        if (result.status === 'ok') {
          console.log(result.data);
          setDetail(result.data);
        }
      });
    }
  }, []);
  return (
    <PageHeaderWrapper>
      {(detail.execution_logs || []).map((item: any) => (
        <CodePreview key={item.index}>{item.content}</CodePreview>
      ))}
    </PageHeaderWrapper>
  );
};

export default Detail;
