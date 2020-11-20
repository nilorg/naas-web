import { Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { getOrganizationResourceList } from './service';

interface RemoteResourceSelectState {
  data: any[];
  value?: any;
  fetching: boolean;
}

interface RemoteResourceSelectProps {
  organizationId?: number;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (fields?: any) => void;
}

const RemoteResourceSelect: React.FC<RemoteResourceSelectProps> = ({
  organizationId,
  placeholder,
  onChange,
  disabled,
}) => {
  const [state, setState] = useState<RemoteResourceSelectState>({
    data: [],
    value: undefined,
    fetching: false,
  });

  const handleChange = (v: number) => {
    setState({
      ...state,
      value: v,
    });
    if (onChange) {
      onChange(v);
    }
  };

  const fetchRes = async () => {
    setState({
      ...state,
      value: undefined,
      data: [],
    });
    if (!organizationId) {
      return;
    }
    const result = await getOrganizationResourceList(organizationId);
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
    fetchRes().then();
  }, [organizationId]);

  return (
    <Select
      value={state.value}
      placeholder={placeholder}
      notFoundContent={state.fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onChange={handleChange}
      style={{ width: '100%' }}
      disabled={disabled}
    >
      {state.data.map((d: any) => (
        <Select.Option key={d.value} value={d.value}>
          {d.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default RemoteResourceSelect;
