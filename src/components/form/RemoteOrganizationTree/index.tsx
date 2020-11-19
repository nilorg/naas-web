import { Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import { getTree } from './service';

interface RemoteOrganizationTreeProps {
  value?: any;
  disabled?: boolean;
  onChange?: (fields?: any) => void;
}

const RemoteOrganizationTree: React.FC<RemoteOrganizationTreeProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<any[]>([]);

  const onExpand = (v: any) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(v);
    setAutoExpandParent(false);
  };

  const onCheck = (v: any) => {
    setCheckedKeys(v);
    if (onChange) {
      onChange(v);
    }
  };

  const onLoadData = async () => {
    const result = await getTree();
    setExpandedKeys([]);
    setCheckedKeys([]);
    if (result.status === 'ok') {
      setTreeData(result.data || []);
    } else {
      setTreeData([]);
    }
  };

  useEffect(() => {
    onLoadData();
  }, []);

  useEffect(() => {
    if (treeData && treeData.length > 0) {
      setCheckedKeys(value || []);
    } else {
      setCheckedKeys([]);
    }
  }, [treeData, value]);

  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      selectable={false}
      treeData={treeData}
      disabled={disabled}
    />
  );
};

export default RemoteOrganizationTree;
