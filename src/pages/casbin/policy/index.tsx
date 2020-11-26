import { Button, Card, Col, message, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import { ActionType } from '@ant-design/pro-table';
import styles from './index.less';
import OrganizationRole from './components/OrganizationRole';
import RemoteResourceSelect from './components/RemoteResourceSelect';
import WebRouteTable from './components/WebRouteTable';
import {
  addRoleResourceAction,
  addRoleResourceWebMenu,
  addRoleResourceWebRoute,
  queryRoleResourceAction,
  queryRoleResourceWebMenu,
  queryRoleResourceWebRoute,
} from './service';
import WebMenuTable from './components/WebMenuTable';
import ActionTable from './components/ActionTable';

const operationTabList = [
  {
    key: 'route',
    tab: <span>路由</span>,
  },
  {
    key: 'menu',
    tab: <span>菜单</span>,
  },
  {
    key: 'action',
    tab: <span>动作</span>,
  },
];

interface RoleState {
  tabKey?: 'route' | 'menu' | 'action';
}

interface WebRouteSelectedState {
  defaultSelectedKeys: string[];
  selectedKeys: string[];
}

interface WebMenuSelectedState {
  defaultSelectedKeys: string[];
  selectedKeys: string[];
}

interface ActionSelectedState {
  defaultSelectedKeys: string[];
  selectedKeys: string[];
}

const TableList: React.FC<{}> = () => {
  const actionRefForWebMenuTable = useRef<ActionType>();
  const actionRefForActionTable = useRef<ActionType>();
  const actionRefForWebRouteTable = useRef<ActionType>();
  const [tabKey, setTabKey] = useState<RoleState['tabKey']>('route');

  const [roleCode, setRoleCode] = useState<string[]>([]);
  const [organizationId, setOrganizationId] = useState<number>(0);
  const [resourceId, setResourceId] = useState<number>(0);

  const [routeSelected, setWebRouteSelected] = useState<WebRouteSelectedState>({
    defaultSelectedKeys: [],
    selectedKeys: [],
  });
  const [menuSelected, setWebMenuSelected] = useState<WebMenuSelectedState>({
    defaultSelectedKeys: [],
    selectedKeys: [],
  });
  const [actionSelected, setActionSelected] = useState<ActionSelectedState>({
    defaultSelectedKeys: [],
    selectedKeys: [],
  });

  const onTabChange = (key: string) => {
    setTabKey(key as RoleState['tabKey']);
  };

  const renderChildrenByTabKey = (resourceServerID: number, tKey: RoleState['tabKey']) => {
    if (tKey === 'menu') {
      return (
        <WebMenuTable
          defaultSelectedRowKeys={menuSelected.defaultSelectedKeys}
          actionRef={actionRefForWebMenuTable}
          resourceServerId={resourceServerID}
          onChange={(keys: any) => {
            setWebMenuSelected({
              ...menuSelected,
              selectedKeys: keys,
            });
          }}
        />
      );
    }
    if (tKey === 'action') {
      return (
        <ActionTable
          defaultSelectedRowKeys={actionSelected.defaultSelectedKeys}
          actionRef={actionRefForActionTable}
          resourceServerId={resourceServerID}
          onChange={(keys: any) => {
            setActionSelected({
              ...actionSelected,
              selectedKeys: keys,
            });
          }}
        />
      );
    }
    if (tKey === 'route') {
      return (
        <WebRouteTable
          defaultSelectedRowKeys={routeSelected.defaultSelectedKeys}
          actionRef={actionRefForWebRouteTable}
          resourceServerId={resourceServerID}
          onChange={(keys: any) => {
            setWebRouteSelected({
              ...routeSelected,
              selectedKeys: keys,
            });
          }}
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
        routes.push(data[i].relation_id);
      }
      setWebRouteSelected({
        ...routeSelected,
        defaultSelectedKeys: routes,
      });
    } else {
      setWebRouteSelected({
        ...routeSelected,
        defaultSelectedKeys: [],
      });
    }
  };

  const loadRoleResourceWebMenu = async (role: string, resourceServerId: number) => {
    if (role === '' || resourceServerId === 0) {
      return;
    }
    const result = await queryRoleResourceWebMenu(role, resourceServerId);
    if (result.status === 'ok') {
      const data = result.data || [];
      const menus = [];
      for (let i = 0; i < data.length; i += 1) {
        menus.push(data[i].relation_id);
      }
      setWebMenuSelected({
        ...routeSelected,
        defaultSelectedKeys: menus,
      });
    } else {
      setWebMenuSelected({
        ...routeSelected,
        defaultSelectedKeys: [],
      });
    }
  };

  const loadRoleResourceAction = async (role: string, resourceServerId: number) => {
    if (role === '' || resourceServerId === 0) {
      return;
    }
    const result = await queryRoleResourceAction(role, resourceServerId);
    if (result.status === 'ok') {
      const data = result.data || [];
      const actions = [];
      for (let i = 0; i < data.length; i += 1) {
        actions.push(data[i].relation_id);
      }
      setActionSelected({
        ...actionSelected,
        defaultSelectedKeys: actions,
      });
    } else {
      setActionSelected({
        ...actionSelected,
        defaultSelectedKeys: [],
      });
    }
  };

  useEffect(() => {
    if (tabKey === 'route') {
      loadRoleResourceWebRoute(roleCode[0] || '', resourceId);
    }
    if (tabKey === 'menu') {
      loadRoleResourceWebMenu(roleCode[0] || '', resourceId);
    }
    if (tabKey === 'action') {
      loadRoleResourceAction(roleCode[0] || '', resourceId);
    }
  }, [roleCode]);

  useEffect(() => {
    if (tabKey === 'route') {
      if (actionRefForWebRouteTable.current) {
        actionRefForWebRouteTable.current.reload();
      }
      loadRoleResourceWebRoute(roleCode[0] || '', resourceId);
    }
    if (tabKey === 'menu') {
      if (actionRefForWebMenuTable.current) {
        actionRefForWebMenuTable.current.reload();
      }
      loadRoleResourceWebMenu(roleCode[0] || '', resourceId);
    }
    if (tabKey === 'action') {
      if (actionRefForActionTable.current) {
        actionRefForActionTable.current.reload();
      }
      loadRoleResourceAction(roleCode[0] || '', resourceId);
    }
  }, [resourceId, tabKey]);

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

  const apply = async () => {
    const hide = message.loading('正在应用');
    try {
      if (
        (roleCode[0] || '') === '' ||
        (tabKey === 'route' && routeSelected.selectedKeys.length === 0) ||
        (tabKey === 'menu' && menuSelected.selectedKeys.length === 0) ||
        (tabKey === 'action' && actionSelected.selectedKeys.length === 0) ||
        tabKey === undefined
      ) {
        hide();
        message.error(`保存失败:请检查角色和配置资源`);
        return false;
      }
      let resp: any;
      if (tabKey === 'route') {
        resp = await addRoleResourceWebRoute(roleCode[0], {
          resource_route_ids: routeSelected.selectedKeys,
          resource_server_id: resourceId,
        });
      } else if (tabKey === 'menu') {
        resp = await addRoleResourceWebMenu(roleCode[0], {
          resource_menu_ids: menuSelected.selectedKeys,
          resource_server_id: resourceId,
        });
      } else if (tabKey === 'action') {
        resp = await addRoleResourceAction(roleCode[0], {
          resource_action_ids: actionSelected.selectedKeys,
          resource_server_id: resourceId,
        });
      }
      hide();
      if (resp.status === 'error') {
        message.error(`保存失败:${resp.error}`);
        return false;
      }
      message.success('保存成功');
      return true;
    } catch (error) {
      hide();
      message.error('修改失败请重试！');
      return false;
    }
  };

  return (
    <PageHeaderWrapper
      title={false}
      extra={[
        <Button key="1" onClick={apply} type="primary">
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
