import React, { useEffect } from 'react';
import { Typography } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';

const CodePreview: React.FC<{}> = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const Detail: React.FC<{}> = () => {
  useEffect(() => {}, []);
  return (
    <PageHeaderWrapper>
      <CodePreview>npm run ui</CodePreview>
    </PageHeaderWrapper>
  );
};

export default Detail;
