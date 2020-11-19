import { Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { getList } from './service';

interface RemoteSelect2State {
  data: any[];
  value?: any;
  fetching: boolean;
}

interface RemoteSelect2Props {
  placeholder?: string;
  type: string;
  value?: any;
  onChange?: (fields?: any) => void;
}

const RemoteSelect2: React.FC<RemoteSelect2Props> = ({ type, placeholder, value, onChange }) => {
  const [state, setState] = useState<RemoteSelect2State>({
    data: [],
    value: undefined,
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

  const fetchRes = async () => {
    setState({
      ...state,
      data: [],
      fetching: true,
    });
    const result = await getList(type);
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
    fetchRes();
  }, []);

  useEffect(() => {
    setState({
      ...state,
      value,
    });
  }, [value]);

  return (
    <Select
      mode="multiple"
      value={state.value}
      placeholder={placeholder}
      notFoundContent={state.fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onChange={handleChange}
      style={{ width: '100%' }}
    >
      {state.data.map((d: any) => (
        <Select.Option key={d.value} value={d.value}>
          {d.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default RemoteSelect2;
