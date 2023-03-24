import * as React from 'react';

import SignIn from './SignIn';
import SignUp from './SignUp';

import { Tabs, Tab } from '@mui/material';

const AuthTabs = () => {
  const [authIndex, setAuthIndex] = React.useState(0);

  const tabChange = (
    e: React.SyntheticEvent<Element, Event>,
    tabValue: number,
  ): void => {
    e.preventDefault();
    setAuthIndex(tabValue);
  };

  return (
    <>
      <Tabs
        variant="fullWidth"
        value={authIndex}
        centered
        onChange={tabChange}
        aria-label="auth tabs"
      >
        <Tab label="Вход" tabIndex={0} />
        <Tab label="Регистрация" tabIndex={1} />
      </Tabs>
      {(() => {
        switch (authIndex) {
          case 0:
            return <SignIn />;
          case 1:
            return <SignUp />;
          default:
            return null;
        }
      })()}
    </>
  );
};
export default AuthTabs;
