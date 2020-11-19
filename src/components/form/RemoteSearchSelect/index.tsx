import { Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { getList, getOne } from './service';

interface RemoteSearchSelectState {
  data: any[];
  value?: any;
  fetching: boolean;
}

interface RemoteSearchSelectProps {
  organizationId?: number;
  placeholder?: string;
  type: string;
  value?: any;
  disabled?: boolean;
  onChange?: (fields?: any) => void;
}

const RemoteSearchSelect: React.FC<RemoteSearchSelectProps> = ({
  organizationId,
  type,
  placeholder,
  value,
  onChange,
  disabled,
}) => {
  const [state, setState] = useState<RemoteSearchSelectState>({
    data: [],
    value: '',
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

  const fetchRes = async (v: any) => {
    setState({
      ...state,
      data: [],
      fetching: true,
    });
    const result = await getList(type, v, organizationId);
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

  const initRes = async (v: any) => {
    setState({
      ...state,
      data: [],
      fetching: true,
    });
    const result = await getOne(type, v);
    if (result.status === 'ok') {
      setState({
        value: v,
        data: [result.data] || [],
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
    if (value) {
      initRes(value);
    }
  }, [value]);

  return (
    <Select
      showSearch
      value={state.value}
      placeholder={placeholder}
      notFoundContent={state.fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={fetchRes}
      onChange={handleChange}
      style={{ width: '100%' }}
      disabled={disabled}
    >
      <Select.Option key="" value="">
        无
      </Select.Option>
      {state.data.map((d: any) => (
        <Select.Option key={d.value} value={d.value}>
          {d.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default RemoteSearchSelect;
