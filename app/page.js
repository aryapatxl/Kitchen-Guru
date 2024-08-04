'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from "@/firebase";
import { Box, Modal, Stack, TextField, Typography, Button, ButtonGroup } from "@mui/material";
import { query, collection, doc, getDoc, setDoc, deleteDoc, getDocs, updateDoc } from "firebase/firestore";
import { UserAuth } from "./Context/AuthContext";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Grabbing current inventory for recipe page!
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
  console.log(inventory)
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="#F5F5EC"
          border="#F5F5EC"
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
              sx={{color:'#141204'}}
            />
            <Button 
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
              sx={{color:'#141204'}}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <ButtonGroup variant="text"  aria-label="Basic button group" >
        <Button sx={{ color: '#141204' }} onClick={() => handleOpen()}>
          Add New Item
        </Button>
       
        <Button sx={{ color: '#141204' }} onClick={() => handleOpen()}>
          Upload Photo
        </Button>
      </ButtonGroup>
      <Box border='#141204'>
        <Box width="800px" height="100px" bgcolor="#141204" display="flex" alignItems="center" justifyContent="center">
          <Typography variant='h2' color='#F5F5EC'>
            Inventory Items
          </Typography>
        </Box>

        <Stack width="800px" height="300px" spacing={.5} overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="95%"
              maxWidth="800px"
              minHeight="100px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#141204"
              borderRadius={2}
              paddingRight={2}
              paddingLeft={2}>

              <Typography variant="h3" color="#F5F5EC" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#F5F5EC" textAlign="center">
                {quantity}
              </Typography>

              <Stack direction="row" spacing={2}>
              <IconButton
                aria-label="add"
                onClick={() => addItem(name)}
                sx={{ color: '#F5F5EC' }}>
                <AddIcon />
              </IconButton>

              <IconButton
                aria-label="delete"
                onClick={() => removeItem(name)}
                sx={{ color: '#F5F5EC' }}>
              <DeleteIcon />
            </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}