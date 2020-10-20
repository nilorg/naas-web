import { Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { getList, getOne } from './service';

interface OrgRemoteSelectState {
  data: any[];
  value?: number;
  fetching: boolean;
}

interface OrgRemoteSelectProps {
  value?: number;
  onChange?: (fields?: number) => void;
}

const OrgRemoteSelect: React.FC<OrgRemoteSelectProps> = ({ value, onChange }) => {
  const [state, setState] = useState<OrgRemoteSelectState>({
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

  const fetchOrg = async (v: any) => {
    setState({
      ...state,
      data: [],
      fetching: true,
    });
    const result = await getList(v);
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

  const initOrg = async (v: number) => {
    setState({
      ...state,
      data: [],
      fetching: true,
    });
    const result = await getOne(v);
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
      initOrg(value);
    }
  }, [value]);

  return (
    <Select
      showSearch
      defaultValue={value}
      value={state.value}
      placeholder="选择组织"
      notFoundContent={state.fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={fetchOrg}
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

export default OrgRemoteSelect;
