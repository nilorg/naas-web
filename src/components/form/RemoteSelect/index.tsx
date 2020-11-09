import { Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { getList, getOne } from './service';

interface RemoteSelectState {
  data: any[];
  value?: number;
  fetching: boolean;
}

interface RemoteSelectProps {
  placeholder?: string;
  type: string;
  value?: number;
  onChange?: (fields?: number) => void;
}

const RemoteSelect: React.FC<RemoteSelectProps> = ({ type, placeholder, value, onChange }) => {
  const [state, setState] = useState<RemoteSelectState>({
    data: [],
    value: 0,
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
    const result = await getList(type, v);
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

  const initRes = async (v: number) => {
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
      defaultValue={value}
      value={state.value}
      placeholder={placeholder}
      notFoundContent={state.fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={fetchRes}
      onChange={handleChange}
      style={{ width: '100%' }}
    >
      <Select.Option key={0} value={0}>
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

export default RemoteSelect;
