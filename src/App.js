import 'bootstrap/dist/css/bootstrap.css';
import { Button } from 'react-bootstrap';
import './index.css';

function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline bg-teal-500 p-4 text-center text-sky-100">
        ENV: {process.env.NODE_ENV}
      </h1>
      <div className="p-4 my-4 bg-slate-300 flex items-center justify-evenly">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="info">Info</Button>
        <Button variant="light">Light</Button>
        <Button variant="dark">Dark</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  );
}

export default App;
