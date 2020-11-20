import { Button, Card, Col, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import { ActionType } from '@ant-design/pro-table';
import styles from './index.less';
import OrganizationRole from './components/OrganizationRole';
import RemoteResourceSelect from './components/RemoteResourceSelect';
import WebRouteTable from './components/WebRouteTable';
import { queryRoleResourceWebRoute } from './service';

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
  // const actionRefForWebMenuTable = useRef<ActionType>();
  // const actionRefForWebFunctionTable = useRef<ActionType>();
  const actionRefForWebRouteTable = useRef<ActionType>();
  const [tabKey, setTabKey] = useState<RoleState['tabKey']>('webRoute');

  const [roleCode, setRoleCode] = useState<string[]>([]);
  const [organizationId, setOrganizationId] = useState<number>(0);
  const [resourceId, setResourceId] = useState<number>(0);

  const [webRouteSelectedRowKeys, setWebRouteSelectedRowKeys] = useState<string[]>([]);
  // const [webFunctionSelectedRowKeys, setWebwebFunctionSelectedRowKeys] = useState<string[]>([]);
  // const [webMenuSelectedRowKeys, setWebMenuSelectedRowKeys] = useState<string[]>([]);

  const onTabChange = (key: string) => {
    setTabKey(key as RoleState['tabKey']);
  };

  const renderChildrenByTabKey = (resourceServerID: number, tKey: RoleState['tabKey']) => {
    if (tKey === 'webMenu') {
      // return <WebRouteTable defaultSelectedRowKeys={webMenuSelectedRowKeys} actionRef={actionRefForWebMenuTable} resourceServerId={resourceServerID} />;
      return <h1>webMenu</h1>;
    }
    if (tKey === 'webFunction') {
      // return <WebRouteTable defaultSelectedRowKeys={webFunctionSelectedRowKeys} actionRef={actionRefForWebFunctionTable} resourceServerId={resourceServerID} />;
      return <h1>webFunction</h1>;
    }
    if (tKey === 'webRoute') {
      return (
        <WebRouteTable
          defaultSelectedRowKeys={webRouteSelectedRowKeys}
          actionRef={actionRefForWebRouteTable}
          resourceServerId={resourceServerID}
        />
      );
    }
    return null;
  };

  const loadRoleResourceWebRoute = async (role: string, resourceServerId: number) => {
    if (role === '' || resourceServerId === 0) {
      return;
    }
    const result = await queryRoleResourceWebRoute(role, resourceServerId);
    if (result.status === 'ok') {
      const data = result.data || [];
      const routes = [];
      for (let i = 0; i < data.length; i += 1) {
        routes.push(data[i].resource_web_route_id);
      }
      setWebRouteSelectedRowKeys(routes);
    } else {
      setWebRouteSelectedRowKeys([]);
    }
  };

  useEffect(() => {
    loadRoleResourceWebRoute(roleCode[0] || '', resourceId);
  }, [roleCode]);

  useEffect(() => {
    if (actionRefForWebRouteTable.current) {
      actionRefForWebRouteTable.current.reload();
    }
    loadRoleResourceWebRoute(roleCode[0] || '', resourceId);
  }, [resourceId]);

  const onOrganizationRoleChange = (v: any) => {
    if (v.organization_id) {
      setOrganizationId(v.organization_id);
    } else {
      setOrganizationId(0);
    }
    if (v.roles) {
      setRoleCode(v.roles);
    } else {
      setRoleCode([]);
    }
  };

  return (
    <PageHeaderWrapper
      title={false}
      extra={[
        <Button key="1" type="primary">
          应用
        </Button>,
      ]}
    >
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={false}>
              <OrganizationRole onChange={onOrganizationRoleChange} />
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              title={
                <RemoteResourceSelect
                  organizationId={organizationId}
                  placeholder="选择资源服务器"
                  onChange={setResourceId}
                />
              }
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={onTabChange}
              bodyStyle={{ paddingTop: '5px', paddingRight: 0, paddingLeft: 0 }}
            >
              {renderChildrenByTabKey(resourceId, tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
    </PageHeaderWrapper>
  );
};

export default TableList;
