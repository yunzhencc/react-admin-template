import { StyleProvider } from '@ant-design/cssinjs';
import { RouterProvider } from '@tanstack/react-router';
import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { router } from '@/lib/router';
import { Providers } from '@/providers';
import './global.css';

export function App() {
  return (
    <StyleProvider layer>
      <ConfigProvider locale={zhCN}>
        <AntApp>
          <Providers>
            <RouterProvider router={router} />
          </Providers>
        </AntApp>
      </ConfigProvider>
    </StyleProvider>
  );
}
