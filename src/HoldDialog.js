import { DialogContentText } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';


export default function  HoldDialog({open, closeDialog}) {
    return (
    <Dialog
        open={open}
        onClose={closeDialog}
    >
        <DialogTitle>Add Item?</DialogTitle>
        <Button onClick={closeDialog}>Yes</Button>
        <Button onClick={closeDialog}>No</Button>
    </Dialog>
    )
}