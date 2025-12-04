import {styled} from "@mui/material/styles";
import React from "react";

const Card = styled("div")`
    display: flex;
    width: 282px;
    flex-direction: column;
    padding: 0;
    box-sizing: border-box;
    border-radius: 20px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
    }

    &:active {
        transform: scale(0.97);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    &.selected {
        border: 3px solid #656B5F;
        box-shadow: 0 12px 28px rgba(101, 107, 95, 0.5);
    }

    &.hidden {
        display: none;
    }
`;
const MemeImg = styled("img")`
    object-fit: cover;
    border-radius: 20px;
    width: 100%;
    height: 212px;
    margin-bottom: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;
const MemeTitle = styled("div")`
    font-size: 16px;
    font-weight: 700;
    text-align: left;
    color: #121212;
    margin-bottom: 10px;
`;
interface MemeItemProps {
    title: string;
    img: string;
    selected?: boolean;
    hidden?: boolean;
    onClick?: () => void;
}
const MemeItem: React.FC<MemeItemProps> = ({ title, img, selected, hidden, onClick }) => {
    return (
        <Card
            className={`${selected ? "selected" : ""} ${hidden ? "hidden" : ""}`}
            onClick={onClick}
        >
            <MemeImg src={img} alt={title} />
            <MemeTitle>{title}</MemeTitle>
        </Card>
    );
};
export default MemeItem;