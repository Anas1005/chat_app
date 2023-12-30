// @mui
'use client'
import { Divider, IconButton, Stack } from '@mui/material';
// import { GithubLogo, GoogleLogo, TwitterLogo } from 'phosphor-react';
import { FaGithub, FaGoogle, FaTwitter} from 'react-icons/fa';

// ----------------------------------------------------------------------

const AuthSocial=()=> {


  const handleGoogleLogin = async () => {

  };

  const handleGithubLogin = async () => {
    
  };

  const handleTwitterLogin = async () => {
    
  };

  return (
    <div>
      <Divider
        sx={{
          my: 2.5,
          typography: 'overline',
          color: 'text.disabled',
          '&::before, ::after': {
            borderTopStyle: 'dashed',
          },
        }}
      >
        OR
      </Divider>

      <Stack direction="row" justifyContent="center" spacing={2}>
        <IconButton onClick={handleGoogleLogin}>
          <FaGoogle color="#DF3E30" />
        </IconButton>

        <IconButton color="inherit" onClick={handleGithubLogin}>
          <FaGithub />
        </IconButton>

        <IconButton onClick={handleTwitterLogin}>
          <FaTwitter color="#1C9CEA" />
        </IconButton>
      </Stack>
    </div>
  );
}
export default AuthSocial;