import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import { getTree } from './service';

interface RemoteRoleTreeSelectState {
  data: any[];
  value?: any;
  fetching: boolean;
}

interface RemoteRoleTreeSelectProps {
  organizationId?: number;
  placeholder?: string;
  value?: any;
  disabled?: boolean;
  onChange?: (fields?: any) => void;
}

const RemoteRoleTreeSelect: React.FC<RemoteRoleTreeSelectProps> = ({
  organizationId,
  placeholder,
  value,
  onChange,
  disabled,
}) => {
  const [state, setState] = useState<RemoteRoleTreeSelectState>({
    data: [],
    value,
    fetching: false,
  });

  const handleChange = (v: any) => {
    setState({
      ...state,
      value: v,
    });
    if (onChange) {
      onChange(v);
    }
  };

  const onLoadData = async (id?: any) => {
    setState({
      ...state,
      data: [],
      fetching: true,
    });
    const result = await getTree(id, organizationId);
    if (result.status === 'ok') {
      setState({
        ...state,
        data: result.data || [],
        fetching: false,
      });
    } else {
      setState({
        ...state,
        data: [],
        fetching: false,
      });
    }
  };

  useEffect(() => {
    onLoadData();
  }, []);

  return (
    <TreeSelect
      showSearch
      treeDefaultExpandAll
      treeDataSimpleMode
      onChange={handleChange}
      loadData={onLoadData}
      treeData={state.data}
      value={state.value}
      treeCheckable
      showCheckedStrategy={TreeSelect.SHOW_PARENT}
      placeholder={placeholder}
      style={{ width: '100%' }}
      disabled={disabled}
    />
  );
};

export default RemoteRoleTreeSelect;
