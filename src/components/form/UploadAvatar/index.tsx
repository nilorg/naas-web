import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { UploadChangeParam, RcFile } from 'antd/lib/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getToken, TokenData } from '@/utils/token';
import styles from './index.less';

function getBase64(img: Blob, callback: (imageUrl: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

function beforeUpload(file: RcFile) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('您只能上传JPG/PNG文件!');
  }
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    message.error('图像必须小于50MB!');
  }
  return isJpgOrPng && isLt50M;
}

interface UploadAvatarState {
  loading: boolean;
  imageUrl: string;
}

interface UploadAvatarProps {
  value?: string;
  onChange?: (fields: string) => void;
}

const UploadAvatar: React.FC<UploadAvatarProps> = ({ value, onChange }) => {
  const [state, setState] = useState<UploadAvatarState>({
    loading: false,
    imageUrl: '',
  });
  const [token, setToken] = useState<TokenData>();
  useEffect(() => {
    const t = getToken();
    if (t) {
      setToken(t);
      setState({ ...state, imageUrl: value || '' });
    }
  }, [value]);

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setState({ ...state, loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as Blob, (imageUrl) => {
        setState({
          imageUrl,
          loading: false,
        });
        const { status, data, error: uploadMessage } = info.file.response;
        if (status === 'ok' && data && data.length > 0) {
          if (onChange) {
            onChange(data[0].fullName);
          }
        } else {
          message.error(`上传出错：${uploadMessage}`);
        }
      });
    }
  };
  const uploadButton = (
    <div>
      {state.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">上传</div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div id="components-upload-demo-avatar">
        <Upload
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="/api/files?q=picture"
          beforeUpload={beforeUpload}
          onChange={handleChange}
          headers={{
            // eslint-disable-next-line @typescript-eslint/camelcase
            Authorization: `Bearer ${token?.access_token}`,
          }}
        >
          {state.imageUrl ? (
            <img src={state.imageUrl} alt="avatar" style={{ width: '100%' }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </div>
    </div>
  );
};

export default UploadAvatar;
