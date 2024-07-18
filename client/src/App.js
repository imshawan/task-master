import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "react-toastify/dist/ReactToastify.css";
import './App.css';

import { ThemeProvider } from '@mui/material/styles';
import Router from './Router';
import theme from './theme/colorTheme';
import Toast from './components/Toast';
import {useAxiosInterceptor} from './hooks/AxiosInterceptor';


function App() {
    useAxiosInterceptor();

    return (
        <ThemeProvider theme={theme}>
            <Toast />
            <Router />
        </ThemeProvider>
    );
}

export default App;
