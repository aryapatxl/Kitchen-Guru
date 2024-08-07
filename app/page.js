'use client'
import React, { useState, useEffect } from 'react';
import { Box, Modal, Stack, TextField, Typography, Button, ButtonGroup } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { firestore } from "@/firebase";
import { query, collection, doc, getDoc, setDoc, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
import { UserAuth } from "./Context/AuthContext";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export const useInventoryData = () => {
  const [inventory, setInventory] = useState([]);
  const { user } = UserAuth(); 
  const userId = user?.uid;

  const updateInventory = async () => {
    if (!userId) return;

    const snapshot = query(collection(firestore, 'users', userId, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        id: doc.id, // DataGrid needs an 'id' field
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, [userId]);

  return inventory;
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const { user } = UserAuth(); // Get user info from AuthContext
  const userId = user?.uid; // Assuming `uid` is the user ID

  const updateInventory = async () => {
    if (!userId) return; // Ensure user ID is available

    const snapshot = query(collection(firestore, 'users', userId, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        id: doc.id, // DataGrid needs an 'id' field
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    if (!userId) return; // Ensure user ID is available

    const docRef = doc(collection(firestore, 'users', userId, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await updateDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    if (!userId) return; // Ensure user ID is available

    const docRef = doc(collection(firestore, 'users', userId, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, [userId]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns = [
    { field: 'name', headerName: 'Item Name',flex:1, headerAlign: 'center', align: 'center'},
    { field: 'quantity', headerName: 'Quantity', flex:1, headerAlign: 'center', align: 'center'  },
    {
      field: 'actions',
      headerName: 'Actions',
      flex:1, 
      headerAlign: 'center', 
      align: 'right',
   
      renderCell: (params) => (
        <Stack direction="row" spacing={2}>
          <IconButton
            aria-label="add"
            onClick={() => addItem(params.row.name)}
            sx={{ color: '#333131' }}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => removeItem(params.row.name)}
            sx={{ color: '#333131' }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      marginTop={"8%"}
      alignItems="center"
      gap={1}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="#F6F5F3"
          border="#F6F5F3"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={1}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              label="Item Name"
              sx={{color:'#333131'}}
            />
            <Button 
              variant="outlined"
              sx={{color:'#333131'}}
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
              
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <ButtonGroup variant="text" aria-label="Basic button group" >
        <Button sx={{ color: '#333131',
                  '&:hover': {
                      backgroundColor: '#E6E2DA' }}} onClick={() => handleOpen()}>
          Add New Item
        </Button>
      </ButtonGroup>
      <Box width="800px" height="400px" bgcolor="#F6F5F3" display="flex" flexDirection="column">
        <Box
          width="100%"
          height="60px"
          bgcolor="#F6F5F3"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant='h2' color='#333131'>
            Inventory Items
          </Typography>
        </Box>
        <Box
          width="100%"
          height="calc(100% - 60px)"
          marginTop="5%"
        >
          <DataGrid
            rows={inventory}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick

            sx={{
              border: 'none',
              bgcolor: '#F6F5F3',
              
              '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#E6E2DA',
            },
              '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            '& .MuiDataGrid-columnHeaders': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}