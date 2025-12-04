import React, { useState, useEffect } from 'react';
import {Grid, Typography, Box, Card, Divider, CardContent, Button, Dialog, TextField, RadioGroup,
    DialogTitle, DialogContent, DialogActions, FormControlLabel, Radio
 } from "@mui/material";
import api from '../api/api-meowfacts';
import { styled } from '@mui/material/styles';


const Title = styled(Typography)`
  margin-top: 0;
  margin-bottom: 48px;
  font-size: 58px;
  font-weight: 800;
  line-height: normal;
  letter-spacing: 0.2px;
  color: #121212;
  font-family: 'Montserrat', sans-serif;
@media(max-width: 805px){
    font-size: 50px;
  }

@media (max-width: 600px) {
    font-size: 35px;
  }
`;

const NumberField = styled(TextField)`
  width: 30%;

  & .MuiOutlinedInput-root {
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;

    & fieldset {
      border-color: #cdc6b3;
      border-width: 2px;
      border-radius: 8px;
    }

    &:hover fieldset {
      border-color: #b5ad99;
    }

    &.Mui-focused fieldset {
      border-color: #a89c8c;
    }

    & input {
      font-size: 16px;
      padding: 10px 10px;
    }
  }

    @media (max-width: 1000px) {
        width: 45%;
    }
    @media (max-width: 750px) {
        width: 60%;
    }
    @media (max-width: 600px) {
        width: 80%;
    }
`;

const CustomButton = styled(Button)`
  padding: 10px 20px;
  margin-top: 16px;
  font-size: 16px;
  font-weight: bold;
  background: linear-gradient(to bottom, #ececdf, #CDC6B3);
  color: #121212;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  width: 25%;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 
    0 4px 0 #a8a296,
    0 6px 10px rgba(0,0,0,0.2);
  transition: all 0.1s ease;
  position: relative;

  &:hover {
    background: linear-gradient(to bottom, #d7d1c0, #a39c87);
    box-shadow: 
      0 3px 0 #868177,
      0 4px 6px rgba(0,0,0,0.2);
  }

  &:active {
    box-shadow: 
      0 1px 0 #868177,
      0 2px 3px rgba(0,0,0,0.2);
    top: 3px;
    transform: translateY(2px);
  }
    
    @media (max-width: 1000px) {
    button{
        width: 40%;
    }

    @media (max-width: 750px) {
        width: 50%;
    }

    @media (max-width: 600px) {
        width: 75%;
    }
`;




const MeowPage = () => {
    const[data, setData] = useState<string[]>([]);
    const[count, setCount] = useState(""); 
    const [message, setMessage] = useState("");

    const fetchFacts = async () => {
        try {
        const res = await api.get(`/`, {params: count});
        console.log("данные с сервера:", res.data);
        setData(res.data);
        } catch (err) {
        console.error("Ошибка загрузки:", err);
        }
    }; 

    function validateAndSet(value: string) {
        if (value.trim() === "") {
            setCount("");
            setMessage("Введите число!");
            return;
        }

        const number = Number(value);

        if (!Number.isInteger(number) || number <= 0) {
            setMessage("Вводите только целое положительное число!");
            return;
        }

        setMessage("");
        setCount(value);
        }
    
    
    useEffect(() => {
        fetchFacts();
    }, [count]);

    return(
        <Grid container direction={'column'} alignItems="center">
            <Title> Random facts about cats</Title>
            <NumberField
                id="numberInput"
                placeholder="Enter tne number of facts"
                value={count}
                onChange={(e) => {
                    validateAndSet(e.target.value);
                }}
            />
            <CustomButton>Generate</CustomButton>
        </Grid>
    )
} 
export default MeowPage;