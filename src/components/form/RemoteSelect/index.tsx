import { Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { getList, getOne } from './service';

interface RemoteSelectState {
  data: any[];
  value?: any;
  fetching: boolean;
}

interface RemoteSelectProps {
  placeholder?: string;
  type: string;
  value?: any;
  onChange?: (fields?: any) => void;
}

const RemoteSelect: React.FC<RemoteSelectProps> = ({ type, placeholder, value, onChange }) => {
  const [state, setState] = useState<RemoteSelectState>({
    data: [],
    value: '',
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
    } else {
      fetchRes('');
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

export default RemoteSelect;
