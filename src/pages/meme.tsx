import { useEffect, useState } from "react";
import {
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MemeItem from "../components/meme_item";
import api from "../api/api-meme.ts";

const IMGFLIP_USERNAME = "irako5";
const IMGFLIP_PASSWORD = "4Xh-CudVw&u%.T4";

const Title = styled(Typography)`
    margin-top: 0;
    font-size: 58px;
    font-weight: 800;
    line-height: normal;
    letter-spacing: 0.2px;
    font-family: 'Montserrat', sans-serif;
    color: #121212;

    @media (max-width: 805px) {
        font-size: 50px;
    }

    @media (max-width: 600px) {
        font-size: 35px;
    }
`;

const InputField = styled(TextField)`
    height: 40px;
    width: 100%;
    & .MuiOutlinedInput-root {
        height: 100%;
        background: #F6F6F3;
        font-family: 'Montserrat', sans-serif;
        font-size: 16px;
        padding: 0;

        & fieldset {
            border: 1px solid #9C968A;
            border-radius: 12px;
        }

        &:hover fieldset {
            border-color: #817c70;
        }

        &.Mui-focused fieldset {
            border-color: #817c70;
        }
    }

    & .MuiInputBase-input {
        height: 100%;
        padding: 0 20px;
        background: transparent;
        color: #121212;
        font-size: 16px;

        &::placeholder {
            color: #9C968A;
            opacity: 1;
        }

        &:focus {
            outline: none;
        }
    }

    & .MuiInputBase-root {
        padding: 0;
    }
    
`;

const SearchRow = styled(Grid)`
    display: grid;
    grid-template-columns: 3fr 1fr; 
    gap: 24px;
    width: 100%;
    margin: 48px 0;

    @media (max-width: 600px) {
        grid-template-columns: 1fr; 
        gap: 12px;
    }
`;

const CustomButton = styled(Button)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    height: '40px',
    background: '#656B5F',
    borderRadius: '12px',
    color: 'white',
    boxSizing: 'border-box',
    transition: 'transform 0.2s ease, background 0.2s ease',
    textTransform: 'none',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '16px',
    fontWeight: 500,

    '&:hover': {
        background: '#9A9E97',
        transform: 'scale(0.98)',
    },

    '&:active': {
        transform: 'scale(0.95)',
        background: '#656B5F',
    },

    '&.Mui-disabled': {
        background: '#B1B4AE',
        cursor: 'not-allowed',
    },
});

interface Meme {
    id: string;
    name: string;
    url: string;
}

const Memes = () => {
    const [memes, setMemes] = useState<Meme[]>([]);
    const [filtered, setFiltered] = useState<Meme[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [topText, setTopText] = useState("");
    const [bottomText, setBottomText] = useState("");
    const [createdUrl, setCreatedUrl] = useState<string | null>(null);

    useEffect(() => {
        const loadMemes = async () => {
            try {
                const response = await api.get("/get_memes");
                const data = response.data;
                setMemes(data.data.memes);
                setFiltered(data.data.memes);
            } catch (error) {
                console.error("Error loading memes:", error);
            }
        };

        loadMemes();
    }, []);

    function Close(){
        setOpen(false);
    }

    useEffect(() => {
        if(open === false){
            setTopText("");
            setBottomText("");
            setCreatedUrl(null);
        }
    }, [open]);

    const onSearch = (value: string) => {
        const text = value.toLowerCase();
        setFiltered(memes.filter((m) => m.name.toLowerCase().includes(text)));
    };

    const createMeme = async () => {
        if (!selectedId) return;

        const formData = new URLSearchParams();
        formData.append("template_id", selectedId);
        formData.append("username", IMGFLIP_USERNAME);
        formData.append("password", IMGFLIP_PASSWORD);
        formData.append("text0", topText);
        formData.append("text1", bottomText);

        try {
            const response = await api.post("/caption_image", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            const data = response.data;
            if (data.success) {
                setCreatedUrl(data.data.url);
            } else {
                alert("Error: " + data.error_message);
            }
        } catch (error) {
            console.error("Error creating meme:", error);
            alert("Failed to create meme. Please try again.");
        }
    };
    return (
        <Grid container direction="column" alignItems="center">
            <Title>Creating memes</Title>
            <Grid size={{ xs: 10 }}>
                <SearchRow>
                        <InputField
                            placeholder="Search..."
                            onChange={(e) => onSearch(e.target.value)}
                        />
                        <CustomButton
                            disabled={!selectedId}
                            onClick={() => setOpen(true)}
                        >
                            Create
                        </CustomButton>
                </SearchRow>
            </Grid>

                <Grid container spacing={3} sx= {{
                    width: "100%",
                    marginTop: "30px",
                    justifyContent: "center"
                }}>

                    {filtered.map((meme) => (
                        <MemeItem
                            key={meme.id}
                            title={meme.name}
                            img={meme.url}
                            selected={meme.id === selectedId}
                            onClick={() => setSelectedId(meme.id)}
                        />
                    ))}
                </Grid>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{fontFamily: "'Montserrat', sans-serif", textAlign: "center"}}>Enter the text for the meme</DialogTitle>
                <DialogContent sx={{fontFamily: "'Montserrat', sans-serif", display: "flex", flexDirection: "column"}}>
                    <InputField
                        fullWidth
                        margin="dense"
                        placeholder ="Top text"
                        value={topText}
                        onChange={(e) => setTopText(e.target.value)}
                        sx={{
                            "& .MuiInputBase-input": {
                                fontSize: "16px",
                                padding: "10px 10px",
                            }
                        }}

                    />
                    <InputField
                        fullWidth
                        margin="dense"
                        placeholder="Bottom text"
                        value={bottomText}
                        onChange={(e) => setBottomText(e.target.value)}
                        sx={{
                            "& .MuiInputBase-input": {
                                fontSize: "16px",
                                padding: "10px 10px",
                            }
                        }}
                    />

                    {createdUrl && (
                        <Box mt={2}>
                            <Typography sx={{fontFamily: "'Montserrat', sans-serif"}}>Your meme:</Typography>
                            <img
                                src={createdUrl}
                                alt="created meme"
                                style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                    marginTop: 10,
                                    borderRadius: 12,
                                    imageRendering: "crisp-edges"
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <CustomButton sx={{ background: "#B1B4AE" }} variant="contained" onClick={Close}>
                        Close
                    </CustomButton>
                    <CustomButton variant="contained" onClick={createMeme}>
                        Create
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default Memes;