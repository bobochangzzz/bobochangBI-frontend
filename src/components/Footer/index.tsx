import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = 'DesignBy bobochang';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/bobochangzzz',
          blankTarget: true,
        },
        {
          key: '啵啵肠智能BI平台',
          title: '啵啵肠智能BI平台',
          href: 'https://blog.bobochang.work',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
