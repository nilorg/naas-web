import { Card, Col, Row } from 'antd';
import React, { useState } from 'react';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';

const operationTabList = [
  {
    key: 'webRoute',
    tab: (
      <span>
        Web路由 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
  {
    key: 'webMenu',
    tab: (
      <span>
        Web菜单 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
  {
    key: 'webFunction',
    tab: (
      <span>
        Web功能 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
];

interface RoleState {
  tabKey?: 'webRoute' | 'webMenu' | 'webFunction';
}

const TableList: React.FC<{}> = () => {
  const [tabKey, setTabKey] = useState<RoleState['tabKey']>('webRoute');

  const onTabChange = (key: string) => {
    setTabKey(key as RoleState['tabKey']);
  };

  const renderChildrenByTabKey = (tKey: RoleState['tabKey']) => {
    if (tKey === 'webMenu') {
      return <h1>web菜单</h1>;
    }
    if (tKey === 'webFunction') {
      return <h1>web功能</h1>;
    }
    if (tKey === 'webRoute') {
      return <h1>web路由</h1>;
    }
    return null;
  };

  return (
    <PageHeaderWrapper title={false}>
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={false}>
              <h1>xxxxxx</h1>
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={onTabChange}
            >
              {renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
    </PageHeaderWrapper>
  );
};

export default TableList;
