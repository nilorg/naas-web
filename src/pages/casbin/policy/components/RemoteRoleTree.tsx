import { Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import { getOrganizationRoleTree } from './service';

interface RemoteRoleTreeProps {
  organizationId?: number;
  value?: any;
  disabled?: boolean;
  onChange?: (fields?: any) => void;
}

const RemoteRoleTree: React.FC<RemoteRoleTreeProps> = ({
  organizationId,
  value,
  onChange,
  disabled,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<any[]>([]);

  const onExpand = (v: any) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(v);
    setAutoExpandParent(false);
  };

  const onSelect = (v: any) => {
    setSelectedKeys(v);
    if (onChange) {
      onChange(v);
    }
  };

  const onLoadData = async (orgId: number) => {
    const result = await getOrganizationRoleTree(orgId);
    setExpandedKeys([]);
    setSelectedKeys([]);
    if (result.status === 'ok') {
      setTreeData(result.data || []);
    } else {
      setTreeData([]);
    }
  };

  useEffect(() => {
    if (organizationId && organizationId > 0) {
      onLoadData(organizationId);
    } else {
      setExpandedKeys([]);
      setSelectedKeys([]);
      setTreeData([]);
    }
  }, [organizationId]);

  useEffect(() => {
    if (treeData && treeData.length > 0) {
      setSelectedKeys(value || []);
    } else {
      setSelectedKeys([]);
    }
  }, [treeData, value]);

  return (
    <Tree
      blockNode
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={treeData}
      disabled={disabled}
    />
  );
};

export default RemoteRoleTree;
