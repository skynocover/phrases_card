import * as React from 'react';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';

import { BackendlessContext } from '../hooks/useBackendless';

export default function Account() {
  const backendlessCtx = React.useContext(BackendlessContext);

  return (
    <>
      <div className="grid w-[40rem] grid-cols-3">
        <div className="flex items-center justify-start col-span-1">
          <Typography>Account ID: </Typography>
        </div>
        <div className="flex flex-col items-center col-span-2">
          <TextField
            fullWidth={true}
            variant="outlined"
            margin="normal"
            value={backendlessCtx.currentUser?.objectId}
          />
        </div>
        <Divider className="col-span-3" />

        <div className="flex items-center justify-start col-span-1">
          <Typography>Email: </Typography>
        </div>
        <div className="flex flex-col items-center col-span-2">
          <TextField
            fullWidth={true}
            variant="outlined"
            margin="normal"
            value={backendlessCtx.currentUser?.email}
          />
        </div>
        <Divider className="col-span-3" />

        <div className="flex items-center justify-start col-span-1">
          <Typography>Name: </Typography>
        </div>
        <div className="flex flex-col items-center col-span-2">
          <TextField
            fullWidth={true}
            variant="outlined"
            margin="normal"
            /** @ts-ignore */
            value={backendlessCtx.currentUser?.name}
          />
        </div>
        <Divider className="col-span-3" />

        <div className="flex items-center justify-start col-span-1">
          <Typography>Create at: </Typography>
        </div>
        <div className="flex flex-col items-center col-span-2">
          <TextField
            fullWidth={true}
            variant="outlined"
            margin="normal"
            /** @ts-ignore */
            value={dayjs(backendlessCtx.currentUser?.created).format('YYYY-MM-DD')}
          />
        </div>
      </div>
    </>
  );
}
