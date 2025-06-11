import { createTheme } from '@mui/material/styles';
import { colors } from '@mui/material';
import { teal, orange } from '@mui/material/colors';

export const themeModes = {
    dark: "dark",
    light: "light",
}

const themeConfigs = {
    custom: ({mode}) => {
        const primaryC = teal[500]; 
        const secondaryC = orange[700]; 

        const customPallete = mode === themeModes.dark ? {
            primary: {
                main: primaryC,
                contrastText: "#ffffff",
            },
            secondary: {
                main: secondaryC,
                contrastText: "#ffffff",
            },
            background: {
                default: "#000000",
                paper: "#131313",
            }
        } : {
            primary: {
                main: primaryC,
            },
            secondary: {
                main: secondaryC,
            },
            background: {
                default: colors.grey['100'],
            }
        };
        return createTheme({
            palette: {
                mode: mode,
                ...customPallete,
            },
            components: {
                MuiButton: {
                    defaultProps: {
                        disableElevation: true,
                    }
                },
            },
        });
    }
};

export default themeConfigs;