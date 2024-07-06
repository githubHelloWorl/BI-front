import { QuestionCircleOutlined } from '@ant-design/icons';
import '@umijs/max';
import React from 'react';
export type SiderTheme = 'light' | 'dark';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function UmiSelectLang(props: { style: { padding: number } }) {
  return null;
}

export const SelectLang = () => {
  return (
    // eslint-disable-next-line react/jsx-no-undef
    <UmiSelectLang
      style={{
        padding: 4,
      }}
    />
  );
};
export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};
