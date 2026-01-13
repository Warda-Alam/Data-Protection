
import { Route, Routes } from 'react-router-dom';
import DemoFlow from './components/DemoFlow';
import DetailSteps from './pages/DetailSteps';

function App() {
    return (
        <Routes>
            <Route path="/" element={<DetailSteps />} />
            <Route path="/detail-steps" element={<DemoFlow />} />
        </Routes>
    );
}

export default App;