import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FF6A6A'
        },
        secondary: {
            main: '#5A20CB'
        },
        background: {
            main: 'rgba(255, 255, 255, 0.2)', // Màu trắng mờ với độ trong suốt là 0.2
            default: '#B0E2FF',
            paper: 'rgba(255, 255, 255, 0.6)'
        },
        text: {
            primary: '#000000',
            secondary: '#696969'
        }
    }
})
