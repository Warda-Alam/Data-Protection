
import { Route, Routes } from 'react-router-dom';
import DemoFlow from './components/DemoFlow';
import DetailSteps from './pages/DetailSteps';
import Animation from './components/Animation';

function App() {
    return (
        <Routes>
            <Route path="/" element={<DetailSteps />} />
            <Route path="/detail-steps" element={<DemoFlow />} />
            <Route path="/animation" element={<Animation />} />
        </Routes>
    );
}

export default App;