
import { Route, Routes } from 'react-router-dom';
import DetailSteps from './pages/DetailSteps';

function App() {
    return (
        <Routes>
            <Route path="/" element={<DetailSteps />} />
        </Routes>
    );
}

export default App;