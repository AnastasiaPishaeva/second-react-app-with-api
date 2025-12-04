import React, { useEffect, useState } from "react";
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

const IMGFLIP_USERNAME = "irako5";
const IMGFLIP_PASSWORD = "4Xh-CudVw&u%.T4";

const Title = styled(Typography)`
    margin-top: 0;
    font-size: 58px;
    font-weight: 800;
    line-height: normal;
    letter-spacing: 0.2px;
    color: #121212;

    @media (max-width: 805px) {
        font-size: 50px;
    }

    @media (max-width: 600px) {
        font-size: 35px;
    }
`;

const SearchField = styled(TextField)`
    flex: 1;
    height: 40px;

    & .MuiOutlinedInput-root {
        height: 100%;
        background: #F6F6F3;
        font-family: 'Montserrat';
        font-size: 16px;
        padding: 0;

        & fieldset {
            border: 1px solid #9C968A;
            border-radius: 12px;
        }
    }

    & .MuiInputBase-input {
        height: 100%;
        padding: 0 20px;
    }
    

    /* Стили для input */
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
    
    @media (max-width: 1000px) {
        width: 80%;
    }

    @media (max-width: 750px) {
        width: 90%;
    }

    @media (max-width: 600px) {
        width: 100%;
    }
`;

const SearchRow = styled('div')`
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    margin: 48px 0;
`;

const CustomButton = styled(Button)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    width: '30%',
    height: '40px',
    background: '#B1B4AE',
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

    // Медиа-запросы
    '@media (max-width: 1000px)': {
        width: '40%',
    },

    '@media (max-width: 750px)': {
        width: '50%',
    },

    '@media (max-width: 600px)': {
        width: '75%',
    },
});

const MemeGrid = styled("div")`
    display: grid;
    grid-template-columns: repeat(auto-fill, 282px);
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    margin-top: 40px;
    box-sizing: border-box;
`;
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
            const response = await fetch("https://api.imgflip.com/get_memes");
            const data = await response.json();
            setMemes(data.data.memes);
            setFiltered(data.data.memes);
        };

        loadMemes();
    }, []);

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

        const response = await fetch("https://api.imgflip.com/caption_image", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            setCreatedUrl(data.data.url);
        } else {
            alert("Error: " + data.error_message);
        }
    };
    return (
        <Grid container direction="column" alignItems="center">
            <Title>Creating memes</Title>

            <SearchRow>
                <SearchField
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

            <MemeGrid>
                {filtered.map((meme) => (
                    <MemeItem
                        key={meme.id}
                        title={meme.name}
                        img={meme.url}
                        selected={meme.id === selectedId}
                        onClick={() => setSelectedId(meme.id)}
                    />
                ))}
            </MemeGrid>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Enter the text for the meme</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Top text"
                        value={topText}
                        onChange={(e) => setTopText(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Bottom text"
                        value={bottomText}
                        onChange={(e) => setBottomText(e.target.value)}
                    />

                    {createdUrl && (
                        <Box mt={2}>
                            <Typography>Your meme:</Typography>
                            <img
                                src={createdUrl}
                                alt="created meme"
                                style={{ width: "100%", marginTop: 10, borderRadius: 12 }}
                            />
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                    <Button variant="contained" onClick={createMeme}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default Memes;