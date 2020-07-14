import React, { useEffect, useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { TokenData, getToken } from '@/utils/token';
import styles from './index.less';

interface UploadPictureProps {
  value?: Array<string>;
  onChange?: (fields: Array<UploadFile>) => void;
}

const UploadPicture: React.FC<UploadPictureProps> = ({ value = [], onChange }) => {
  const [files, setFiles] = useState<Array<UploadFile>>([]);
  const [token, setToken] = useState<TokenData>();
  useEffect(() => {
    const t = getToken();
    if (t) {
      setToken(t);
    }
    // uid: string;
    // size: number;
    // name: string;
    console.log(value);
    const fs = value.map(
      (v: string) =>
        ({
          uid: v,
          size: 0,
          name: v,
          url: `/api/v1/fs/${v}`,
          // thumbUrl: `https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`,
          status: 'success',
        } as UploadFile),
    );

    setFiles(fs);
  }, []);

  const handleChange = (info: UploadChangeParam) => {
    setFiles(info.fileList);
    if (onChange) {
      const fileIds = info.fileList.map((file) => {
        if (file.status === 'done' || file.status === 'success') {
          if (file.response) {
            const { code, data, message: uploadMessage } = file.response;
            if (code === 1 && data && data.length > 0) {
              return data[0].fileId;
            }
            message.error(`上传出错：${uploadMessage}`);
          } else {
            return file.uid;
          }
        }
        return null;
      });
      onChange(fileIds.filter((i) => i != null));
    }
  };

  return (
    <div className={styles.container}>
      <div id="components-upload-demo-picture-style">
        <div>
          <Upload
            action="/api/v1/fs"
            listType="picture"
            onChange={handleChange}
            multiple
            // defaultFileList={files}
            fileList={files}
            headers={{
              // eslint-disable-next-line @typescript-eslint/camelcase
              Authorization: `Bearer ${token?.access_token}`,
            }}
          >
            <Button>
              <UploadOutlined /> 上传
            </Button>
          </Upload>
        </div>
      </div>
    </div>
  );
};

export default UploadPicture;
